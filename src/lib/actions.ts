'use server'

import type { IncidentStatus, Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { TEAM_COLORS, type ServiceLink } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/session'

export type ActionResult = { ok: true } | { ok: false; error: string }
const fail = (error: string): ActionResult => ({ ok: false, error })
const refresh = () => revalidatePath('/app', 'layout')

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || null)

/* ----------------------------------- Teams ----------------------------------- */

const teamSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome da equipe.').max(60),
  color: z.enum(Object.keys(TEAM_COLORS) as [string, ...string[]]).default('sky'),
})

export async function saveTeam(teamId: string | null, formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = teamSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(parsed.error.issues[0]!.message)
  if (teamId) {
    const updated = await prisma.team.updateMany({ where: { id: teamId, ownerId: user.id }, data: parsed.data })
    if (!updated.count) return fail('Equipe não encontrada.')
  } else {
    await prisma.team.create({ data: { ...parsed.data, ownerId: user.id } })
  }
  refresh()
  return { ok: true }
}

export async function deleteTeam(teamId: string): Promise<ActionResult> {
  const user = await requireUser()
  await prisma.team.deleteMany({ where: { id: teamId, ownerId: user.id } })
  refresh()
  return { ok: true }
}

/* ---------------------------------- Services --------------------------------- */

// Links are typed one per line as "Label | https://url" to keep the form simple.
function parseLinkLines(raw: string): ServiceLink[] | string {
  const links: ServiceLink[] = []
  for (const line of raw.split('\n').map((item) => item.trim()).filter(Boolean)) {
    const [label, url] = line.includes('|') ? line.split('|').map((part) => part.trim()) : [line, line]
    if (!z.url({ protocol: /^https?$/ }).safeParse(url).success) return `Link inválido: "${line}"`
    links.push({ label: label || url!, url: url! })
  }
  return links
}

const serviceSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome do serviço.').max(80),
  description: optionalText(1000),
  teamId: z
    .string()
    .optional()
    .transform((value) => value || null),
  tier: z.enum(['CRITICAL', 'HIGH', 'STANDARD']),
  status: z.enum(['OPERATIONAL', 'DEGRADED', 'OUTAGE', 'MAINTENANCE']).default('OPERATIONAL'),
  tags: z
    .string()
    .optional()
    .transform((value) =>
      [...new Set((value ?? '').split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean))].slice(0, 12),
    ),
  links: z.string().max(4000).optional().default(''),
})

export async function saveService(serviceId: string | null, formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = serviceSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(parsed.error.issues[0]!.message)
  const links = parseLinkLines(parsed.data.links)
  if (typeof links === 'string') return fail(links)

  const teamId = parsed.data.teamId
    ? ((await prisma.team.findFirst({ where: { id: parsed.data.teamId, ownerId: user.id } }))?.id ?? null)
    : null
  const data = { ...parsed.data, teamId, links: links as Prisma.InputJsonArray }

  if (serviceId) {
    const updated = await prisma.service.updateMany({ where: { id: serviceId, ownerId: user.id }, data })
    if (!updated.count) return fail('Serviço não encontrado.')
    refresh()
    return { ok: true }
  }
  const service = await prisma.service.create({ data: { ...data, ownerId: user.id } })
  refresh()
  redirect(`/app/services/${service.id}`)
}

export async function setServiceStatus(serviceId: string, status: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE' | 'MAINTENANCE'): Promise<ActionResult> {
  const user = await requireUser()
  const updated = await prisma.service.updateMany({ where: { id: serviceId, ownerId: user.id }, data: { status } })
  if (!updated.count) return fail('Serviço não encontrado.')
  refresh()
  return { ok: true }
}

export async function deleteService(serviceId: string): Promise<ActionResult> {
  const user = await requireUser()
  await prisma.service.deleteMany({ where: { id: serviceId, ownerId: user.id } })
  refresh()
  redirect('/app/services')
}

/* ---------------------------------- Runbooks --------------------------------- */

const runbookSchema = z.object({
  title: z.string().trim().min(3, 'Dê um título ao runbook.').max(120),
  content: z.string().trim().min(10, 'Escreva o procedimento.').max(50000),
  serviceId: z
    .string()
    .optional()
    .transform((value) => value || null),
})

export async function saveRunbook(runbookId: string | null, formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = runbookSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(parsed.error.issues[0]!.message)
  const serviceId = parsed.data.serviceId
    ? ((await prisma.service.findFirst({ where: { id: parsed.data.serviceId, ownerId: user.id } }))?.id ?? null)
    : null

  let id = runbookId
  if (runbookId) {
    const updated = await prisma.runbook.updateMany({ where: { id: runbookId, ownerId: user.id }, data: { ...parsed.data, serviceId } })
    if (!updated.count) return fail('Runbook não encontrado.')
  } else {
    id = (await prisma.runbook.create({ data: { ...parsed.data, serviceId, ownerId: user.id } })).id
  }
  refresh()
  redirect(`/app/runbooks/${id}`)
}

export async function deleteRunbook(runbookId: string): Promise<ActionResult> {
  const user = await requireUser()
  await prisma.runbook.deleteMany({ where: { id: runbookId, ownerId: user.id } })
  refresh()
  redirect('/app/runbooks')
}

/* ---------------------------------- Incidents -------------------------------- */

const incidentSchema = z.object({
  title: z.string().trim().min(5, 'Descreva o incidente em uma frase.').max(160),
  severity: z.enum(['SEV1', 'SEV2', 'SEV3']),
  message: z.string().trim().min(5, 'Escreva a primeira atualização.').max(4000),
})

export async function createIncident(formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = incidentSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(parsed.error.issues[0]!.message)
  const serviceIds = formData.getAll('serviceIds').map(String)
  const services = await prisma.service.findMany({ where: { id: { in: serviceIds }, ownerId: user.id }, select: { id: true } })
  if (services.length === 0) return fail('Selecione pelo menos um serviço afetado.')

  const incident = await prisma.$transaction(async (tx) => {
    const created = await tx.incident.create({
      data: {
        ownerId: user.id,
        title: parsed.data.title,
        severity: parsed.data.severity,
        services: { connect: services },
        updates: { create: { status: 'INVESTIGATING', message: parsed.data.message, author: user.name } },
      },
    })
    await tx.service.updateMany({
      where: { id: { in: services.map((service) => service.id) } },
      data: { status: parsed.data.severity === 'SEV1' ? 'OUTAGE' : 'DEGRADED' },
    })
    return created
  })
  refresh()
  redirect(`/app/incidents/${incident.id}`)
}

const updateSchema = z.object({
  status: z.enum(['INVESTIGATING', 'IDENTIFIED', 'MONITORING', 'RESOLVED']),
  message: z.string().trim().min(3, 'Escreva a atualização.').max(4000),
})

export async function postIncidentUpdate(incidentId: string, formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = updateSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return fail(parsed.error.issues[0]!.message)
  const incident = await prisma.incident.findFirst({
    where: { id: incidentId, ownerId: user.id },
    include: { services: { select: { id: true } } },
  })
  if (!incident) return fail('Incidente não encontrado.')
  const status = parsed.data.status as IncidentStatus
  const resolving = status === 'RESOLVED' && incident.status !== 'RESOLVED'

  await prisma.$transaction(async (tx) => {
    await tx.incidentUpdate.create({ data: { incidentId, status, message: parsed.data.message, author: user.name } })
    await tx.incident.update({
      where: { id: incidentId },
      data: { status, resolvedAt: status === 'RESOLVED' ? (incident.resolvedAt ?? new Date()) : null },
    })
    if (resolving) {
      // Restore only services that have no other open incident.
      for (const { id } of incident.services) {
        const stillOpen = await tx.incident.count({ where: { id: { not: incidentId }, status: { not: 'RESOLVED' }, services: { some: { id } } } })
        if (!stillOpen) await tx.service.update({ where: { id }, data: { status: 'OPERATIONAL' } })
      }
    }
  })
  refresh()
  return { ok: true }
}

export async function savePostmortem(incidentId: string, formData: FormData): Promise<ActionResult> {
  const user = await requireUser()
  const content = String(formData.get('postmortem') ?? '').trim().slice(0, 50000)
  const updated = await prisma.incident.updateMany({ where: { id: incidentId, ownerId: user.id }, data: { postmortem: content || null } })
  if (!updated.count) return fail('Incidente não encontrado.')
  refresh()
  return { ok: true }
}

/* ----------------------------------- Search ---------------------------------- */

export type SearchHit = { type: 'service' | 'runbook' | 'incident'; id: string; title: string; subtitle: string; href: string }

export async function search(query: string): Promise<SearchHit[]> {
  const user = await requireUser()
  const term = query.trim().slice(0, 80)
  if (term.length < 2) return []
  const contains = { contains: term, mode: 'insensitive' as const }

  const [services, runbooks, incidents] = await Promise.all([
    prisma.service.findMany({
      where: { ownerId: user.id, OR: [{ name: contains }, { description: contains }, { tags: { has: term.toLowerCase() } }] },
      include: { team: { select: { name: true } } },
      take: 6,
    }),
    prisma.runbook.findMany({
      where: { ownerId: user.id, OR: [{ title: contains }, { content: contains }] },
      include: { service: { select: { name: true } } },
      take: 6,
    }),
    prisma.incident.findMany({ where: { ownerId: user.id, title: contains }, orderBy: { startedAt: 'desc' }, take: 6 }),
  ])

  return [
    ...services.map((service) => ({ type: 'service' as const, id: service.id, title: service.name, subtitle: service.team?.name ?? 'Sem equipe', href: `/app/services/${service.id}` })),
    ...runbooks.map((runbook) => ({ type: 'runbook' as const, id: runbook.id, title: runbook.title, subtitle: runbook.service?.name ?? 'Geral', href: `/app/runbooks/${runbook.id}` })),
    ...incidents.map((incident) => ({ type: 'incident' as const, id: incident.id, title: incident.title, subtitle: incident.severity, href: `/app/incidents/${incident.id}` })),
  ]
}
