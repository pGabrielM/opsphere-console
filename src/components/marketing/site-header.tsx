import Link from 'next/link'
import { Github } from '@/components/marketing/github-icon'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/">
          <Logo dark />
        </Link>
        <nav className="hidden items-center gap-6 font-mono text-xs tracking-wider text-zinc-400 uppercase md:flex">
          <a href="#recursos" className="hover:text-white">
            Recursos
          </a>
          <a href="#como-funciona" className="hover:text-white">
            Fluxo
          </a>
          <a href="#stack" className="hover:text-white">
            Stack
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <a
            href={siteConfig.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hidden p-2 text-zinc-400 hover:text-white sm:block"
          >
            <Github className="size-5" />
          </a>
          <Button asChild size="sm">
            <Link href="/login">Abrir demo</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
