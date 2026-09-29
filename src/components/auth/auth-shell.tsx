import Link from 'next/link'
import type { ReactNode } from 'react'
import { Logo } from '@/components/logo'
import { siteConfig } from '@/config/site'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[0.9fr_1fr]">
      <div className="relative hidden overflow-hidden bg-zinc-950 lg:block">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(#5f6f8c 1px, transparent 1px), linear-gradient(90deg, #5f6f8c 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="w-fit">
            <Logo dark />
          </Link>
          <div>
            <p className="max-w-md text-3xl leading-tight font-semibold tracking-tight text-white">{siteConfig.tagline}</p>
            <ul className="mt-8 space-y-2.5 font-mono text-xs text-zinc-400">
              {siteConfig.highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-emerald-400">&gt;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link href="/" className="w-fit lg:hidden">
          <Logo />
        </Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <p className="section-label">{'// autenticação'}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">{title}</h1>
          <p className="mt-1 mb-8 text-sm text-zinc-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
