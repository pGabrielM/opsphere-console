// Seeds (or resets) the demo workspace. Safe to run repeatedly.
import { config } from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

config({ path: '.env.local', quiet: true })
config({ quiet: true })

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL) })
const DEMO = { email: 'demo@opsphere.dev', password: 'demo1234', name: 'Rafaela Nunes' }
const ago = (hours) => new Date(Date.now() - hours * 3600000)

const TEAMS = [
  { name: 'Plataforma', color: 'sky' },
  { name: 'Pagamentos', color: 'violet' },
  { name: 'Dados', color: 'emerald' },
  { name: 'Atendimento', color: 'amber' },
]

const SERVICES = [
  ['Plataforma', 'Loja virtual (web)', 'Front-end Next.js da loja: vitrine, carrinho e checkout.', 'CRITICAL', ['nextjs', 'vercel', 'web'], [['Produção', 'https://loja.horizonte.com.br'], ['Homologação', 'https://hml.loja.horizonte.com.br'], ['Repositório', 'https://github.com/horizonte/loja-web']]],
  ['Plataforma', 'API de catálogo', 'Produtos, estoque e preços. Consumida pela loja e pelo app.', 'CRITICAL', ['laravel', 'postgres', 'redis'], [['Produção', 'https://api.horizonte.com.br/catalog'], ['Grafana', 'https://grafana.horizonte.com.br/d/catalog'], ['Repositório', 'https://github.com/horizonte/catalog-api']]],
  ['Plataforma', 'Cluster Kubernetes', 'Cluster de produção (3 nós) com ingress Nginx e cert-manager.', 'CRITICAL', ['k8s', 'infra'], [['Rancher', 'https://rancher.horizonte.com.br'], ['Grafana', 'https://grafana.horizonte.com.br/d/k8s']]],
  ['Plataforma', 'CDN e imagens', 'Cloudflare + redimensionamento de imagens de produto.', 'HIGH', ['cloudflare', 'cdn'], [['Painel', 'https://dash.cloudflare.com']]],
  ['Pagamentos', 'Gateway de pagamentos', 'Integração com adquirente para cartão e Pix. Webhooks de confirmação.', 'CRITICAL', ['pix', 'cartao', 'webhooks'], [['Produção', 'https://pay.horizonte.com.br'], ['Status do adquirente', 'https://status.adquirente.com.br'], ['Repositório', 'https://github.com/horizonte/payments']]],
  ['Pagamentos', 'Antifraude', 'Score de risco por pedido antes da captura.', 'HIGH', ['risco', 'python'], [['Dashboard', 'https://grafana.horizonte.com.br/d/fraud']]],
  ['Pagamentos', 'Conciliação financeira', 'Job diário que concilia vendas x repasses do adquirente.', 'STANDARD', ['cron', 'financeiro'], [['Rundeck', 'https://rundeck.horizonte.com.br/job/conciliacao']]],
  ['Dados', 'Data warehouse', 'BigQuery com vendas, estoque e marketing. Atualizado de hora em hora.', 'HIGH', ['bigquery', 'dbt'], [['Console', 'https://console.cloud.google.com/bigquery']]],
  ['Dados', 'Pipeline de eventos', 'Coleta de eventos de navegação e compra (Kafka → BigQuery).', 'STANDARD', ['kafka', 'streaming'], []],
  ['Atendimento', 'Central de atendimento', 'Helpdesk integrado aos pedidos e ao WhatsApp.', 'HIGH', ['whatsapp', 'helpdesk'], [['Painel', 'https://suporte.horizonte.com.br']]],
  ['Atendimento', 'Notificações (e-mail e WhatsApp)', 'Disparo transacional: confirmação de pedido, envio e entrega.', 'HIGH', ['email', 'whatsapp', 'filas'], [['Horizon', 'https://api.horizonte.com.br/horizon']]],
  [null, 'VPN corporativa', 'Acesso remoto dos colaboradores (WireGuard).', 'STANDARD', ['vpn', 'rede'], []],
]

const RUNBOOKS = [
  ['Gateway de pagamentos', 'Pagamentos Pix não confirmam', `> **Sintoma:** pedidos ficam em "aguardando pagamento" mesmo com o Pix pago pelo cliente.

## Diagnóstico

1. Verifique a fila de webhooks no Horizon: \`/horizon/failed\`
2. Confira o status do adquirente em https://status.adquirente.com.br
3. Procure erros de assinatura nos logs:

\`\`\`bash
kubectl logs -n payments deploy/payments-api --since=30m | grep -i "webhook"
\`\`\`

## Correção

| Causa | Ação |
| --- | --- |
| Webhooks falhando | Reprocessar: \`php artisan payments:replay-webhooks --since=1h\` |
| Adquirente fora | Ativar banner de instabilidade no checkout |
| Certificado expirado | Seguir o runbook "Renovar certificado mTLS" |

## Validação

- [ ] Pedidos de teste confirmam em menos de 30 s
- [ ] Fila de webhooks zerada

## Escalonamento

Sem solução em 15 min → acionar o plantão de Pagamentos e abrir chamado no adquirente.`],
  ['API de catálogo', 'Rollback de deploy da API de catálogo', `## Quando usar

Aumento de erros 5xx ou latência logo após um deploy.

## Passos

1. Identifique a última revisão estável:

\`\`\`bash
kubectl rollout history deploy/catalog-api -n catalog
\`\`\`

2. Faça o rollback:

\`\`\`bash
kubectl rollout undo deploy/catalog-api -n catalog
kubectl rollout status deploy/catalog-api -n catalog
\`\`\`

3. Limpe o cache de produtos se houve mudança de schema: \`php artisan cache:clear --tags=catalog\`

## Validação

- Taxa de erro < 0,5% no Grafana
- Página de produto carrega em < 800 ms`],
  ['Cluster Kubernetes', 'Nó do cluster sem responder', `## Sintoma

Alertas \`KubeNodeNotReady\` e pods em \`Pending\`.

## Passos

1. \`kubectl get nodes -o wide\` — confirme qual nó está \`NotReady\`
2. Drene o nó: \`kubectl drain <no> --ignore-daemonsets --delete-emptydir-data\`
3. Reinicie a VM pelo painel do provedor
4. Após voltar: \`kubectl uncordon <no>\`

> Se mais de um nó cair ao mesmo tempo, **não drene** — acione o plantão de Plataforma.`],
  ['Loja virtual (web)', 'Loja lenta em horário de pico', `## Checklist rápido

- [ ] Hit rate da CDN acima de 90%?
- [ ] API de catálogo com latência normal?
- [ ] Algum deploy nos últimos 30 minutos?

## Ações

1. Aumente as réplicas temporariamente: \`kubectl scale deploy/loja-web --replicas=8 -n web\`
2. Ative o modo "vitrine estática" no painel de feature flags
3. Comunique o time de marketing se houver campanha ativa`],
  ['Notificações (e-mail e WhatsApp)', 'Fila de notificações acumulada', `## Diagnóstico

1. Abra o Horizon e veja a fila \`notifications\`
2. Verifique se o provedor de e-mail está limitando envio (erro 429)

## Correção

- Aumente os workers: ajuste \`HORIZON_NOTIFICATIONS_MAX=20\` e faça redeploy
- Se for limite do provedor, reduza a taxa e reprocesse depois: \`php artisan queue:retry --queue=notifications\``],
  [null, 'Comunicação durante incidentes', `## Papéis

| Papel | Responsabilidade |
| --- | --- |
| Comandante | Coordena, decide e prioriza |
| Comunicação | Atualiza stakeholders a cada 30 min |
| Especialistas | Investigam e aplicam correções |

## Canais

- Sala de guerra: canal \`#incidente-ativo\`
- Atualizações externas: página de status

## Modelo de atualização

**Status:** investigando / identificado / monitorando / resolvido
**Impacto:** quem é afetado e como
**Próxima atualização:** em 30 minutos`],
]

const INCIDENTS = [
  {
    title: 'Confirmação de Pix atrasada para parte dos pedidos',
    severity: 'SEV2',
    status: 'IDENTIFIED',
    startedHoursAgo: 1.2,
    services: ['Gateway de pagamentos'],
    updates: [
      [1.2, 'INVESTIGATING', 'Alertas de pedidos parados em "aguardando pagamento". Cerca de 8% dos pedidos Pix afetados.'],
      [0.8, 'INVESTIGATING', 'Fila de webhooks com 1.240 itens falhando por timeout na chamada ao adquirente.'],
      [0.4, 'IDENTIFIED', 'Adquirente confirmou lentidão na API de consulta. Ativamos reprocessamento automático a cada 5 minutos enquanto isso.'],
    ],
  },
  {
    title: 'Loja fora do ar após deploy da API de catálogo',
    severity: 'SEV1',
    status: 'RESOLVED',
    startedHoursAgo: 26 * 24,
    resolvedAfter: 0.6,
    services: ['API de catálogo', 'Loja virtual (web)'],
    updates: [
      [0, 'INVESTIGATING', 'Loja retornando erro 500 em todas as páginas de produto.'],
      [0.15, 'IDENTIFIED', 'Migração do deploy 2.14 removeu coluna ainda usada pelo cache. Iniciando rollback.'],
      [0.35, 'MONITORING', 'Rollback concluído, taxa de erro normalizando.'],
      [0.6, 'RESOLVED', 'Loja estável por 15 minutos. Encerrando.'],
    ],
    postmortem: `## Resumo

O deploy 2.14 da API de catálogo aplicou uma migração que removeu a coluna \`legacy_sku\`, ainda lida pelo cache de produtos. A loja ficou indisponível por 36 minutos.

## Impacto

- 36 minutos de indisponibilidade das páginas de produto
- ~420 sessões de compra interrompidas

## Causa raiz

Migração destrutiva no mesmo deploy da mudança de código, sem etapa de compatibilidade.

## O que funcionou

- Alerta disparou em 1 minuto
- Runbook de rollback seguido sem improviso

## Ações de melhoria

- [x] Separar migrações destrutivas em deploy posterior (expand/contract)
- [ ] Teste de fumaça das páginas de produto no pipeline
- [ ] Alerta de erro 5xx por rota`,
  },
  {
    title: 'Atraso de 3 horas na conciliação financeira',
    severity: 'SEV3',
    status: 'RESOLVED',
    startedHoursAgo: 9 * 24,
    resolvedAfter: 3.2,
    services: ['Conciliação financeira'],
    updates: [
      [0, 'INVESTIGATING', 'Job diário não terminou no horário esperado.'],
      [1.5, 'IDENTIFIED', 'Arquivo de repasses do adquirente chegou com 3x o volume habitual (Black Friday antecipada).'],
      [3.2, 'RESOLVED', 'Job concluído após aumento de memória do worker. Relatório entregue ao financeiro.'],
    ],
  },
  {
    title: 'Mensagens de WhatsApp de envio não disparadas',
    severity: 'SEV2',
    status: 'RESOLVED',
    startedHoursAgo: 15 * 24,
    resolvedAfter: 1.4,
    services: ['Notificações (e-mail e WhatsApp)', 'Central de atendimento'],
    updates: [
      [0, 'INVESTIGATING', 'Clientes relatando que não receberam código de rastreio.'],
      [0.7, 'IDENTIFIED', 'Token do provedor de WhatsApp expirou.'],
      [1.4, 'RESOLVED', 'Token renovado e 2.380 mensagens reprocessadas.'],
    ],
  },
]

async function main() {
  await prisma.user.deleteMany({ where: { email: DEMO.email } })
  const user = await prisma.user.create({
    data: { email: DEMO.email, name: DEMO.name, passwordHash: await bcrypt.hash(DEMO.password, 10) },
  })

  const teams = {}
  for (const team of TEAMS) teams[team.name] = await prisma.team.create({ data: { ...team, ownerId: user.id } })

  const services = {}
  for (const [index, [team, name, description, tier, tags, links]] of SERVICES.entries()) {
    services[name] = await prisma.service.create({
      data: {
        ownerId: user.id,
        teamId: team ? teams[team].id : null,
        name,
        description,
        tier,
        tags,
        links: links.map(([label, url]) => ({ label, url })),
        updatedAt: ago(index * 7),
      },
    })
  }

  for (const [index, [service, title, content]] of RUNBOOKS.entries()) {
    await prisma.runbook.create({
      data: { ownerId: user.id, serviceId: service ? services[service].id : null, title, content, createdAt: ago(900 - index), updatedAt: ago(index * 30 + 5) },
    })
  }

  for (const incident of INCIDENTS) {
    const startedAt = ago(incident.startedHoursAgo)
    const created = await prisma.incident.create({
      data: {
        ownerId: user.id,
        title: incident.title,
        severity: incident.severity,
        status: incident.status,
        startedAt,
        resolvedAt: incident.resolvedAfter ? new Date(startedAt.getTime() + incident.resolvedAfter * 3600000) : null,
        postmortem: incident.postmortem ?? null,
        services: { connect: incident.services.map((name) => ({ id: services[name].id })) },
      },
    })
    for (const [offset, status, message] of incident.updates) {
      const createdAt = incident.resolvedAfter !== undefined ? new Date(startedAt.getTime() + offset * 3600000) : ago(offset)
      await prisma.incidentUpdate.create({ data: { incidentId: created.id, status, message, author: DEMO.name, createdAt } })
    }
    if (incident.status !== 'RESOLVED') {
      await prisma.service.updateMany({
        where: { id: { in: incident.services.map((name) => services[name].id) } },
        data: { status: incident.severity === 'SEV1' ? 'OUTAGE' : 'DEGRADED' },
      })
    }
  }
  await prisma.service.update({ where: { id: services['Pipeline de eventos'].id }, data: { status: 'MAINTENANCE' } })

  console.log(`Demo account ready: ${DEMO.email} / ${DEMO.password}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
