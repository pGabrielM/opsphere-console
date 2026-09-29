import { ArrowLeft, BookOpen, ExternalLink, Plus } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ConfirmButton } from '@/components/confirm-button'
import { IncidentForm } from '@/components/ops/incident-form'
import { ServiceForm } from '@/components/ops/service-form'
import { ServiceStatusMenu } from '@/components/ops/service-status-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteService } from '@/lib/actions'
import { incidentStatusLabel, incidentStatusTone, parseLinks, severityTone, teamDot, tierLabel, tierTone } from '@/lib/constants'
import { formatDate, relative } from '@/lib/format'
import { getService, getServiceOptions, getTeams } from '@/lib/queries'
import { requireUser } from '@/lib/session'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Serviço' }

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const { id } = await params
  const [service, teams, options] = await Promise.all([getService(user.id, id), getTeams(user.id), getServiceOptions(user.id)])
  if (!service) notFound()
  const links = parseLinks(service.links)

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/app/services" className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800">
        <ArrowLeft className="size-4" /> Catálogo
      </Link>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">{service.name}</h1>
            <Badge tone={tierTone[service.tier]}>{tierLabel[service.tier]}</Badge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
            {service.team ? (
              <span className="flex items-center gap-1.5">
                <span className={cn('size-2 rounded-full', teamDot(service.team.color))} /> {service.team.name}
              </span>
            ) : (
              <span>Sem equipe responsável</span>
            )}
            <span>Atualizado {relative(service.updatedAt)}</span>
            {service.tags.length > 0 && <span>{service.tags.map((tag) => `#${tag}`).join(' ')}</span>}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <ServiceStatusMenu serviceId={service.id} status={service.status} />
          <ServiceForm teams={teams} service={{ ...service, links }} />
          <IncidentForm services={options} preselected={service.id} />
          <ConfirmButton compact title="Excluir serviço?" description="Runbooks continuam existindo, sem vínculo com o serviço." action={deleteService.bind(null, service.id)} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobre</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-line text-zinc-700">{service.description ?? 'Sem descrição.'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Runbooks</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/app/runbooks/new?service=${service.id}`}>
                  <Plus /> Novo
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {service.runbooks.length === 0 ? (
                <p className="text-sm text-zinc-500">Nenhum procedimento documentado ainda.</p>
              ) : (
                <ul className="space-y-2">
                  {service.runbooks.map((runbook) => (
                    <li key={runbook.id}>
                      <Link href={`/app/runbooks/${runbook.id}`} className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2.5 hover:bg-zinc-50">
                        <BookOpen className="size-4 text-brand-600" />
                        <span className="flex-1 text-sm font-medium">{runbook.title}</span>
                        <span className="text-xs text-zinc-400">{relative(runbook.updatedAt)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent>
              {links.length === 0 ? (
                <p className="text-sm text-zinc-500">Nenhum link cadastrado.</p>
              ) : (
                <ul className="space-y-1">
                  {links.map((link) => (
                    <li key={link.url + link.label}>
                      <a href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-zinc-50">
                        <ExternalLink className="size-4 text-zinc-400" />
                        <span className="font-medium text-zinc-800">{link.label}</span>
                        <span className="truncate text-xs text-zinc-400">{link.url.replace(/^https?:\/\//, '')}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Histórico de incidentes</CardTitle>
            </CardHeader>
            <CardContent>
              {service.incidents.length === 0 ? (
                <p className="text-sm text-zinc-500">Sem incidentes registrados.</p>
              ) : (
                <ul className="space-y-3">
                  {service.incidents.map((incident) => (
                    <li key={incident.id}>
                      <Link href={`/app/incidents/${incident.id}`} className="block hover:underline">
                        <div className="flex items-center gap-2">
                          <Badge tone={severityTone[incident.severity]}>{incident.severity}</Badge>
                          <Badge tone={incidentStatusTone[incident.status]}>{incidentStatusLabel[incident.status]}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-zinc-900">{incident.title}</p>
                        <p className="text-xs text-zinc-500">{formatDate(incident.startedAt)}</p>
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
