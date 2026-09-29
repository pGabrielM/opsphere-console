import { Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ConfirmButton } from '@/components/confirm-button'
import { TeamForm } from '@/components/ops/team-form'
import { PageHeader } from '@/components/shell/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { deleteTeam } from '@/lib/actions'
import { serviceStatusDot, teamDot } from '@/lib/constants'
import { getTeams } from '@/lib/queries'
import { requireUser } from '@/lib/session'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Equipes' }

export default async function TeamsPage() {
  const user = await requireUser()
  const teams = await getTeams(user.id)
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Equipes" description="Cada serviço tem um dono. Aqui você vê quem cuida de quê." actions={<TeamForm />} />
      {teams.length === 0 ? (
        <EmptyState icon={Users} title="Nenhuma equipe" description="Crie equipes para organizar o catálogo." action={<TeamForm />} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {teams.map((team) => (
            <div key={team.id} className="rounded-lg border border-zinc-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <span className={cn('size-3 rounded-full', teamDot(team.color))} />
                <h2 className="flex-1 font-semibold">{team.name}</h2>
                <TeamForm team={team} />
                <ConfirmButton compact title="Excluir equipe?" description="Os serviços ficam sem equipe responsável." action={deleteTeam.bind(null, team.id)} />
              </div>
              <ul className="mt-4 space-y-1.5">
                {team.services.map((service) => (
                  <li key={service.id}>
                    <Link href={`/app/services/${service.id}`} className="flex items-center gap-2 text-sm text-zinc-700 hover:underline">
                      <span className={cn('size-2 rounded-full', serviceStatusDot[service.status])} />
                      {service.name}
                    </Link>
                  </li>
                ))}
                {team.services.length === 0 && <li className="text-sm text-zinc-400">Nenhum serviço.</li>}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
