import 'server-only'

import { prisma } from '@/lib/prisma'

// New accounts get a small example catalog to explore.
export async function onUserCreated(userId: string): Promise<void> {
  const team = await prisma.team.create({ data: { ownerId: userId, name: 'Plataforma', color: 'sky' } })
  const service = await prisma.service.create({
    data: {
      ownerId: userId,
      teamId: team.id,
      name: 'Site institucional',
      description: 'Exemplo — edite ou apague este serviço.',
      tier: 'HIGH',
      tags: ['web'],
      links: [{ label: 'Produção', url: 'https://example.com' }],
    },
  })
  await prisma.runbook.create({
    data: {
      ownerId: userId,
      serviceId: service.id,
      title: 'Como reiniciar o site',
      content: '## Quando usar\n\nSite fora do ar ou lento.\n\n## Passos\n\n1. Verifique o status do provedor\n2. Faça o redeploy da última versão estável\n3. Confirme que a página inicial responde 200',
    },
  })
}
