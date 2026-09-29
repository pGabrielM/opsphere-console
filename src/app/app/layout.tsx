import Link from 'next/link'
import type { ReactNode } from 'react'
import { Logo } from '@/components/logo'
import { CommandPalette } from '@/components/search/command-palette'
import { MobileNav } from '@/components/shell/mobile-nav'
import { SidebarNav } from '@/components/shell/sidebar-nav'
import { UserMenu } from '@/components/shell/user-menu'
import { siteConfig } from '@/config/site'
import { requireUser } from '@/lib/session'

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser()
  const isDemo = user.email === siteConfig.demo.email

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col bg-zinc-950 px-3 py-4 lg:flex">
        <Link href="/app" className="mb-7 px-2">
          <Logo dark />
        </Link>
        <SidebarNav />
        <div className="mt-auto border-t border-white/10 px-2 pt-3 font-mono text-[10px] leading-relaxed tracking-wide text-zinc-500 uppercase">
          <p className="flex items-center gap-1.5 text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400" /> workspace ativo
          </p>
          <a href={siteConfig.author.url} className="mt-1 block hover:text-zinc-300">
            open source · {siteConfig.author.name}
          </a>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        {isDemo && (
          <div className="bg-brand-600 px-4 py-1 text-center font-mono text-[11px] tracking-wide text-white uppercase">
            Você está na conta demo — fique à vontade para criar, editar e apagar dados.
          </div>
        )}
        <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <MobileNav />
          <div className="lg:hidden">
            <Logo compact />
          </div>
          <div className="ml-2 hidden flex-1 sm:block lg:ml-0">
            <CommandPalette />
          </div>
          <div className="ml-auto">
            <UserMenu name={user.name} email={user.email} />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
