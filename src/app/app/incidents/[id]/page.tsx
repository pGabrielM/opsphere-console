import { ArrowLeft, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IncidentUpdateForm } from '@/components/ops/incident-update-form'
import { PostmortemEditor } from '@/components/ops/postmortem-editor'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { incidentStatusLabel, incidentStatusTone, serviceStatusDot, severityLabel, severityTone } from '@/lib/constants'
import { duration, formatDate } from '@/lib/format'
import { getIncident } from '@/lib/queries'
import { requireUser } from '@/lib/session'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Incidente' }

const dotByStatus = { INVESTIGATING: 'bg-red-500', IDENTIFIED: 'bg-amber-500', MONITORING: 'bg-sky-500', RESOLVED: 'bg-emerald-500' } as const

export default async function IncidentPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const incident = await getIncident(user.id, (await params).id)
  if (!incident) notFound()
  const runbooks = incident.services.flatMap((service) => service.runbooks.map((runbook) => ({ ...runbook, service: service.name })))

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/app/incidents" className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800">
        <ArrowLeft className="size-4" /> Incidentes
      </Link>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={severityTone[incident.severity]}>{severityLabel[incident.severity]}</Badge>
          <Badge tone={incidentStatusTone[incident.status]}>{incidentStatusLabel[incident.status]}</Badge>
        </div>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">{incident.title}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Início {formatDate(incident.startedAt)} ·{' '}
          {incident.resolvedAt ? `resolvido em ${duration(incident.startedAt, incident.resolvedAt)}` : `em andamento há ${duration(incident.startedAt, new Date())}`}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {incident.status !== 'RESOLVED' && <IncidentUpdateForm incidentId={incident.id} status={incident.status} />}
          <Card>
            <CardHeader>
              <CardTitle>Linha do tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-6 border-l border-zinc-200 pl-6">
                {incident.updates.map((update) => (
                  <li key={update.id} className="relative">
                    <span className={cn('absolute top-1.5 -left-[29px] size-2.5 rounded-full ring-4 ring-white', dotByStatus[update.status])} />
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span className="font-semibold text-zinc-800">{incidentStatusLabel[update.status]}</span>
                      <span>·</span>
                      <span>{formatDate(update.createdAt, "dd/MM 'às' HH:mm")}</span>
                      <span>·</span>
                      <span>{update.author}</span>
                    </div>
                    <p className="mt-1 text-sm whitespace-pre-line text-zinc-700">{update.message}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Post-mortem</CardTitle>
            </CardHeader>
            <CardContent>
              <PostmortemEditor incidentId={incident.id} value={incident.postmortem} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Serviços afetados</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {incident.services.map((service) => (
                  <li key={service.id}>
                    <Link href={`/app/services/${service.id}`} className="flex items-center gap-2 text-sm hover:underline">
                      <span className={cn('size-2 rounded-full', serviceStatusDot[service.status])} />
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Runbooks relacionados</CardTitle>
            </CardHeader>
            <CardContent>
              {runbooks.length === 0 ? (
                <p className="text-sm text-zinc-500">Nenhum runbook para esses serviços.</p>
              ) : (
                <ul className="space-y-2">
                  {runbooks.map((runbook) => (
                    <li key={runbook.id}>
                      <Link href={`/app/runbooks/${runbook.id}`} className="flex gap-2 text-sm hover:underline">
                        <BookOpen className="mt-0.5 size-4 shrink-0 text-brand-600" />
                        <span>
                          {runbook.title}
                          <span className="block text-xs text-zinc-500">{runbook.service}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
