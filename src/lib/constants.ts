import type { IncidentStatus, ServiceStatus, Severity, Tier } from '@prisma/client'

export const serviceStatusLabel: Record<ServiceStatus, string> = {
  OPERATIONAL: 'Operacional',
  DEGRADED: 'Degradado',
  OUTAGE: 'Indisponível',
  MAINTENANCE: 'Manutenção',
}
export const serviceStatusTone = { OPERATIONAL: 'green', DEGRADED: 'amber', OUTAGE: 'red', MAINTENANCE: 'blue' } as const
export const serviceStatusDot = { OPERATIONAL: 'bg-emerald-500', DEGRADED: 'bg-amber-500', OUTAGE: 'bg-red-500', MAINTENANCE: 'bg-sky-500' } as const

export const tierLabel: Record<Tier, string> = { CRITICAL: 'Crítico', HIGH: 'Alto', STANDARD: 'Padrão' }
export const tierTone = { CRITICAL: 'red', HIGH: 'amber', STANDARD: 'neutral' } as const

export const severityLabel: Record<Severity, string> = { SEV1: 'SEV1 · crítico', SEV2: 'SEV2 · alto', SEV3: 'SEV3 · moderado' }
export const severityTone = { SEV1: 'red', SEV2: 'amber', SEV3: 'blue' } as const

export const incidentStatusLabel: Record<IncidentStatus, string> = {
  INVESTIGATING: 'Investigando',
  IDENTIFIED: 'Causa identificada',
  MONITORING: 'Monitorando',
  RESOLVED: 'Resolvido',
}
export const incidentStatusTone = { INVESTIGATING: 'red', IDENTIFIED: 'amber', MONITORING: 'blue', RESOLVED: 'green' } as const

export const TEAM_COLORS = {
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  zinc: 'bg-zinc-500',
} as const

export const teamDot = (color: string) => TEAM_COLORS[(color in TEAM_COLORS ? color : 'sky') as keyof typeof TEAM_COLORS]

export type ServiceLink = { label: string; url: string }

export function parseLinks(value: unknown): ServiceLink[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (item): item is ServiceLink => typeof item?.label === 'string' && typeof item?.url === 'string',
  )
}
