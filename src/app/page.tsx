import { BookOpen, Command, FileText, Network, Server, Siren } from 'lucide-react'
import { Landing, type LandingContent } from '@/components/marketing/landing'

const content: LandingContent = {
  eyebrow: 'Para times de TI e plantão',
  title: 'Tudo o que o plantão precisa às 3 da manhã, em um só lugar',
  subtitle:
    'Catálogo de serviços com dono e criticidade, runbooks em Markdown ligados a cada sistema e incidentes com linha do tempo e post-mortem — com busca global para achar qualquer coisa em segundos.',
  screenshot: { src: '/screenshots/overview.png', alt: 'Visão geral do Op Sphere' },
  proof: ['Catálogo por equipe', 'Runbooks em Markdown', 'Busca global Ctrl+K'],
  features: [
    { icon: Server, title: 'Catálogo de serviços', description: 'Cada sistema com equipe dona, criticidade, status atual, tags e links de produção, dashboards e repositório.' },
    { icon: BookOpen, title: 'Runbooks', description: 'Procedimentos em Markdown com tabelas, código e checklists, com editor e pré-visualização lado a lado.' },
    { icon: Siren, title: 'Gestão de incidentes', description: 'Severidade SEV1–3, atualizações de status em linha do tempo e serviços afetados mudando de status sozinhos.' },
    { icon: FileText, title: 'Post-mortem', description: 'Modelo pronto com impacto, causa raiz e ações de melhoria, anexado ao incidente.' },
    { icon: Command, title: 'Busca global', description: 'Ctrl+K encontra serviços, runbooks e incidentes pelo nome, descrição, tags ou conteúdo.' },
    { icon: Network, title: 'Contexto na hora certa', description: 'Ao abrir um incidente, os runbooks dos serviços afetados aparecem ao lado da linha do tempo.' },
  ],
  steps: [
    { title: 'Mapeie os serviços', description: 'Cadastre sistemas, equipes responsáveis e os links que todo mundo vive procurando.' },
    { title: 'Documente os procedimentos', description: 'Transforme conhecimento de corredor em runbooks que qualquer pessoa do plantão consegue seguir.' },
    { title: 'Responda e aprenda', description: 'Declare incidentes, publique atualizações e registre o post-mortem para não repetir o problema.' },
  ],
  stack: [
    { name: 'Next.js 16 + React 19', detail: 'Server Components e Server Actions; nenhuma API intermediária exposta.' },
    { name: 'Prisma 7 + PostgreSQL', detail: 'Relações N:N entre incidentes e serviços, arrays nativos para tags e JSONB para links.' },
    { name: 'Transações', detail: 'Declarar ou resolver um incidente atualiza o status dos serviços afetados de forma atômica.' },
    { name: 'Markdown seguro', detail: 'react-markdown + GFM sem HTML bruto — conteúdo de runbook não executa scripts.' },
    { name: 'cmdk', detail: 'Paleta de comandos acessível por teclado com busca no servidor.' },
    { name: 'Auth.js v5', detail: 'Área autenticada protegida no proxy e dados isolados por conta.' },
  ],
}

export default function HomePage() {
  return <Landing content={content} />
}
