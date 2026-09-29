import { BookOpen, LayoutDashboard, Server, Siren, Users } from 'lucide-react'

export const appNav = [
  { href: '/app', label: 'Visão geral', icon: LayoutDashboard, exact: true },
  { href: '/app/services', label: 'Serviços', icon: Server },
  { href: '/app/runbooks', label: 'Runbooks', icon: BookOpen },
  { href: '/app/incidents', label: 'Incidentes', icon: Siren },
  { href: '/app/teams', label: 'Equipes', icon: Users },
]
