import { Logo } from '@/components/logo'
import { siteConfig } from '@/config/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950 text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <Logo dark />
          <span className="font-mono">© {new Date().getFullYear()} · MIT</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono uppercase">
          <a href={siteConfig.repositoryUrl} target="_blank" rel="noreferrer" className="hover:text-white">
            código-fonte
          </a>
          <a href={siteConfig.author.url} target="_blank" rel="noreferrer" className="hover:text-white">
            {siteConfig.author.name}
          </a>
        </div>
      </div>
    </footer>
  )
}
