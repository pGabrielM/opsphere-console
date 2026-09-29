'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { appNav } from '@/config/nav'
import { cn } from '@/lib/utils'

/** Navegação escura (barra lateral desktop e gaveta mobile). */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-0.5">
      <p className="section-label mb-2 px-2 !text-zinc-500">Workspace</p>
      {appNav.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-2.5 border-l-2 px-2.5 py-2 text-[13px] font-medium transition-colors',
              active
                ? 'border-brand-400 bg-white/[0.07] text-white'
                : 'border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100',
            )}
          >
            <Icon className={cn('size-4', active && 'text-brand-300')} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
