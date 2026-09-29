import 'server-only'

import { prisma } from '@/lib/prisma'

export async function getOverview(userId: string) {
  const [services, openIncidents, recentIncidents, runbooks] = await Promise.all([
    prisma.service.findMany({
      where: { ownerId: userId },
      include: { team: true },
      orderBy: [{ tier: 'asc' }, { name: 'asc' }],
    }),
    prisma.incident.findMany({
      where: { ownerId: userId, status: { not: 'RESOLVED' } },
      include: { services: { select: { id: true, name: true } }, updates: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: [{ severity: 'asc' }, { startedAt: 'desc' }],
    }),
    prisma.incident.findMany({
      where: { ownerId: userId, status: 'RESOLVED' },
      orderBy: { resolvedAt: 'desc' },
      take: 5,
    }),
    prisma.runbook.findMany({
      where: { ownerId: userId },
      include: { service: { select: { name: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
  ])
  return { services, openIncidents, recentIncidents, runbooks }
}

export async function getTeams(userId: string) {
  return prisma.team.findMany({
    where: { ownerId: userId },
    include: { services: { select: { id: true, name: true, status: true } } },
    orderBy: { name: 'asc' },
  })
}

export async function getServiceOptions(userId: string) {
  return prisma.service.findMany({ where: { ownerId: userId }, select: { id: true, name: true }, orderBy: { name: 'asc' } })
}

export async function getServices(userId: string) {
  return prisma.service.findMany({
    where: { ownerId: userId },
    include: { team: true, _count: { select: { runbooks: true } } },
    orderBy: [{ tier: 'asc' }, { name: 'asc' }],
  })
}

export async function getService(userId: string, serviceId: string) {
  return prisma.service.findFirst({
    where: { id: serviceId, ownerId: userId },
    include: {
      team: true,
      runbooks: { orderBy: { updatedAt: 'desc' } },
      incidents: { orderBy: { startedAt: 'desc' }, take: 10 },
    },
  })
}

export async function getRunbooks(userId: string) {
  return prisma.runbook.findMany({
    where: { ownerId: userId },
    include: { service: { select: { id: true, name: true, team: { select: { name: true, color: true } } } } },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getRunbook(userId: string, runbookId: string) {
  return prisma.runbook.findFirst({
    where: { id: runbookId, ownerId: userId },
    include: { service: { select: { id: true, name: true } } },
  })
}

export async function getIncidents(userId: string) {
  return prisma.incident.findMany({
    where: { ownerId: userId },
    include: { services: { select: { id: true, name: true } } },
    orderBy: [{ resolvedAt: { sort: 'desc', nulls: 'first' } }, { startedAt: 'desc' }],
  })
}

export async function getIncident(userId: string, incidentId: string) {
  return prisma.incident.findFirst({
    where: { id: incidentId, ownerId: userId },
    include: {
      services: { include: { runbooks: { select: { id: true, title: true } } } },
      updates: { orderBy: { createdAt: 'desc' } },
    },
  })
}
