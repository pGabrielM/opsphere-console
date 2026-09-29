import { BookOpen, CheckCircle2, Siren } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { IncidentForm } from '@/components/ops/incident-form'
import { PageHeader } from '@/components/shell/page-header'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serviceStatusDot, serviceStatusLabel, severityTone, incidentStatusLabel, teamDot, tierLabel, tierTone } from '@/lib/constants'
import { duration, relative } from '@/lib/format'
import { getOverview } from '@/lib/queries'
import { requireUser } from '@/lib/session'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Visão geral' }

export default async function OverviewPage() {
  const user = await requireUser()
  const data = await getOverview(user.id)
  const affected = data.services.filter((service) => service.status !== 'OPERATIONAL')
  const counts = (['OPERATIONAL', 'DEGRADED', 'OUTAGE', 'MAINTENANCE'] as const).map((status) => ({
    status,
    count: data.services.filter((service) => service.status === status).length,
  }))

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Visão geral"
        description="Saúde dos serviços, incidentes em andamento e procedimentos recentes."
        actions={<IncidentForm services={data.services.map(({ id, name }) => ({ id, name }))} />}
      />

      <div className={cn('mb-6 rounded-xl border p-5', data.openIncidents.length ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50')}>
        <div className="flex items-center gap-3">
          {data.openIncidents.length ? <Siren className="size-5 text-red-600" /> : <CheckCircle2 className="size-5 text-emerald-600" />}
          <p className={cn('font-semibold', data.openIncidents.length ? 'text-red-900' : 'text-emerald-900')}>
            {data.openIncidents.length
              ? `${data.openIncidents.length} ${data.openIncidents.length === 1 ? 'incidente em andamento' : 'incidentes em andamento'}`
              : 'Nenhum incidente em andamento'}
          </p>
        </div>
        {data.openIncidents.length > 0 && (
          <ul className="mt-4 space-y-2">
            {data.openIncidents.map((incident) => (
              <li key={incident.id}>
                <Link href={`/app/incidents/${incident.id}`} className="flex flex-col gap-2 rounded-lg bg-white p-3 shadow-sm hover:shadow-md sm:flex-row sm:items-center">
                  <Badge tone={severityTone[incident.severity]}>{incident.severity}</Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">{incident.title}</p>
                    <p className="truncate text-xs text-zinc-500">
                      {incidentStatusLabel[incident.status]} · {incident.services.map((service) => service.name).join(', ')}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500">há {duration(incident.startedAt, new Date())}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {counts.map(({ status, count }) => (
          <Card key={status} className="p-4">
            <div className="flex items-center gap-2">
              <span className={cn('size-2 rounded-full', serviceStatusDot[status])} />
              <p className="text-xs text-zinc-500">{serviceStatusLabel[status]}</p>
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{count}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Serviços críticos e afetados</CardTitle>
            <Link href="/app/services" className="text-xs font-medium text-brand-700 hover:underline">
              Catálogo completo
            </Link>
          </CardHeader>
          <ul className="divide-y divide-zinc-100">
            {[...affected, ...data.services.filter((service) => service.tier === 'CRITICAL' && service.status === 'OPERATIONAL')].slice(0, 8).map((service) => (
              <li key={service.id}>
                <Link href={`/app/services/${service.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-50">
                  <span className={cn('size-2.5 shrink-0 rounded-full', serviceStatusDot[service.status])} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{service.name}</p>
                    {service.team && (
                      <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <span className={cn('size-1.5 rounded-full', teamDot(service.team.color))} />
                        {service.team.name}
                      </p>
                    )}
                  </div>
                  <Badge tone={tierTone[service.tier]}>{tierLabel[service.tier]}</Badge>
                  <span className="w-24 text-right text-xs text-zinc-500">{serviceStatusLabel[service.status]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Runbooks atualizados</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.runbooks.map((runbook) => (
                  <li key={runbook.id}>
                    <Link href={`/app/runbooks/${runbook.id}`} className="flex gap-3 hover:underline">
                      <BookOpen className="mt-0.5 size-4 shrink-0 text-brand-600" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-zinc-900">{runbook.title}</span>
                        <span className="text-xs text-zinc-500">
                          {runbook.service?.name ?? 'Geral'} · {relative(runbook.updatedAt)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Resolvidos recentemente</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.recentIncidents.map((incident) => (
                  <li key={incident.id}>
                    <Link href={`/app/incidents/${incident.id}`} className="block hover:underline">
                      <p className="truncate text-sm text-zinc-900">{incident.title}</p>
                      <p className="text-xs text-zinc-500">
                        {incident.severity} · duração {duration(incident.startedAt, incident.resolvedAt!)}
                      </p>
                    </Link>
                  </li>
                ))}
                {data.recentIncidents.length === 0 && <p className="text-sm text-zinc-500">Nada por aqui.</p>}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
