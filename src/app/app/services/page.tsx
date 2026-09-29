import { BookOpen, Server } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ServiceForm } from '@/components/ops/service-form'
import { PageHeader } from '@/components/shell/page-header'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { serviceStatusDot, serviceStatusLabel, teamDot, tierLabel, tierTone } from '@/lib/constants'
import { getServices, getTeams } from '@/lib/queries'
import { requireUser } from '@/lib/session'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Serviços' }

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ team?: string }> }) {
  const user = await requireUser()
  const { team: teamFilter } = await searchParams
  const [services, teams] = await Promise.all([getServices(user.id), getTeams(user.id)])
  const visible = teamFilter ? services.filter((service) => (teamFilter === 'none' ? !service.teamId : service.teamId === teamFilter)) : services

  const groups = [
    ...teams.map((team) => ({ key: team.id, name: team.name, color: team.color, items: visible.filter((service) => service.teamId === team.id) })),
    { key: 'none', name: 'Sem equipe', color: 'zinc', items: visible.filter((service) => !service.teamId) },
  ].filter((group) => group.items.length > 0)

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Catálogo de serviços" description="Quem é dono de quê, o quão crítico é e onde encontrar cada coisa." actions={<ServiceForm teams={teams} />} />

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/app/services" className={cn('rounded-full border px-3 py-1 text-sm', !teamFilter ? 'border-brand-600 bg-brand-600 text-white' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50')}>
          Todas as equipes
        </Link>
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/app/services?team=${team.id}`}
            className={cn('flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm', teamFilter === team.id ? 'border-brand-600 bg-brand-600 text-white' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50')}
          >
            <span className={cn('size-2 rounded-full', teamDot(team.color))} />
            {team.name}
          </Link>
        ))}
      </div>

      {services.length === 0 ? (
        <EmptyState icon={Server} title="Catálogo vazio" description="Cadastre os serviços que sua equipe mantém." action={<ServiceForm teams={teams} />} />
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.key}>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <span className={cn('size-2 rounded-full', teamDot(group.color))} />
                {group.name}
                <span className="font-normal text-zinc-400">{group.items.length}</span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map((service) => (
                  <Link
                    key={service.id}
                    href={`/app/services/${service.id}`}
                    className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-zinc-900 group-hover:text-brand-700">{service.name}</p>
                      <Badge tone={tierTone[service.tier]}>{tierLabel[service.tier]}</Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 min-h-10 text-sm text-zinc-500">{service.description ?? 'Sem descrição.'}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <span className={cn('size-2 rounded-full', serviceStatusDot[service.status])} />
                        {serviceStatusLabel[service.status]}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="size-3.5" /> {service._count.runbooks}
                      </span>
                      <span className="truncate">{service.tags.slice(0, 3).map((tag) => `#${tag}`).join(' ')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
