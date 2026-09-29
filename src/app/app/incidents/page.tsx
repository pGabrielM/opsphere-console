import { ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { IncidentForm } from '@/components/ops/incident-form'
import { PageHeader } from '@/components/shell/page-header'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { incidentStatusLabel, incidentStatusTone, severityTone } from '@/lib/constants'
import { duration, formatDate } from '@/lib/format'
import { getIncidents, getServiceOptions } from '@/lib/queries'
import { requireUser } from '@/lib/session'

export const metadata: Metadata = { title: 'Incidentes' }

export default async function IncidentsPage() {
  const user = await requireUser()
  const [incidents, services] = await Promise.all([getIncidents(user.id), getServiceOptions(user.id)])
  const resolved = incidents.filter((incident) => incident.resolvedAt)
  const mttr = resolved.length ? resolved.reduce((sum, incident) => sum + (incident.resolvedAt!.getTime() - incident.startedAt.getTime()), 0) / resolved.length : null

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Incidentes" description="Tudo o que já deu errado, como foi resolvido e o que aprendemos." actions={<IncidentForm services={services} />} />
      {incidents.length > 0 && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { label: 'Em andamento', value: String(incidents.length - resolved.length) },
            { label: 'Resolvidos', value: String(resolved.length) },
            { label: 'Tempo médio de resolução', value: mttr === null ? '—' : duration(0, mttr) },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
      {incidents.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Nenhum incidente" description="Quando algo der errado, declare o incidente para coordenar a resposta." />
      ) : (
        <ul className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          {incidents.map((incident) => (
            <li key={incident.id}>
              <Link href={`/app/incidents/${incident.id}`} className="flex flex-col gap-2 px-5 py-4 hover:bg-zinc-50 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex gap-2">
                  <Badge tone={severityTone[incident.severity]}>{incident.severity}</Badge>
                  <Badge tone={incidentStatusTone[incident.status]}>{incidentStatusLabel[incident.status]}</Badge>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-900">{incident.title}</p>
                  <p className="truncate text-xs text-zinc-500">{incident.services.map((service) => service.name).join(', ')}</p>
                </div>
                <div className="text-xs text-zinc-500 sm:text-right">
                  <p>{formatDate(incident.startedAt, 'dd/MM/yyyy HH:mm')}</p>
                  <p>{incident.resolvedAt ? `durou ${duration(incident.startedAt, incident.resolvedAt)}` : `há ${duration(incident.startedAt, new Date())}`}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
