import { ArrowRight, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Github } from '@/components/marketing/github-icon'
import { SiteFooter } from '@/components/marketing/site-footer'
import { SiteHeader } from '@/components/marketing/site-header'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

export type LandingContent = {
  eyebrow: string
  title: string
  subtitle: string
  screenshot: { src: string; alt: string }
  proof: string[]
  features: { icon: LucideIcon; title: string; description: string }[]
  steps: { title: string; description: string }[]
  stack: { name: string; detail: string }[]
}

export function Landing({ content }: { content: LandingContent }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                'linear-gradient(#5f6f8c 1px, transparent 1px), linear-gradient(90deg, #5f6f8c 1px, transparent 1px)',
              backgroundSize: '44px 44px',
              maskImage: 'radial-gradient(ellipse at 30% 30%, black, transparent 70%)',
            }}
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:pt-24">
            <div>
              <p className="inline-flex items-center gap-2 border border-brand-400/40 bg-brand-500/10 px-2.5 py-1 font-mono text-[11px] tracking-widest text-brand-200 uppercase">
                <span className="size-1.5 rounded-full bg-emerald-400" /> {content.eyebrow}
              </p>
              <h1 className="mt-6 text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-white sm:text-5xl">
                {content.title}
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-400">{content.subtitle}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/login">
                    Entrar na conta demo <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="border-white/20 bg-transparent text-zinc-200 hover:bg-white/10 hover:text-white">
                  <a href={siteConfig.repositoryUrl} target="_blank" rel="noreferrer">
                    <Github className="size-4" /> Código-fonte
                  </a>
                </Button>
              </div>
              <ul className="mt-8 space-y-2 font-mono text-xs text-zinc-400">
                {content.proof.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-400" strokeWidth={3} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-md border border-white/15 bg-zinc-900 shadow-2xl shadow-brand-600/20">
                <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
                  <span className="size-2 rounded-full bg-red-400/80" />
                  <span className="size-2 rounded-full bg-amber-400/80" />
                  <span className="size-2 rounded-full bg-emerald-400/80" />
                  <span className="ml-3 font-mono text-[10px] text-zinc-500">opsphere / visão geral</span>
                </div>
                <Image
                  src={content.screenshot.src}
                  alt={content.screenshot.alt}
                  width={1600}
                  height={1000}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="recursos" className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="section-label !text-brand-300">{'// recursos'}</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-white">
              Tudo o que o plantão precisa, com cada peça ligada à outra
            </h2>
            <div className="mt-10 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {content.features.map((feature, index) => (
                <div key={feature.title} className="bg-zinc-950 p-6 transition-colors hover:bg-zinc-900">
                  <div className="flex items-center justify-between">
                    <feature.icon className="size-5 text-brand-300" />
                    <span className="font-mono text-[11px] text-zinc-600">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="border-y border-white/10 bg-zinc-900/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="section-label !text-brand-300">{'// fluxo'}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Como funciona</h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {content.steps.map((step, index) => (
                <li key={step.title} className="border-t-2 border-brand-500 pt-4">
                  <span className="font-mono text-xs text-brand-300">STEP {String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="stack" className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="section-label !text-brand-300">{'// stack'}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Por dentro</h2>
            <dl className="mt-8 divide-y divide-white/10 border border-white/10">
              {content.stack.map((item) => (
                <div key={item.name} className="grid gap-1 px-5 py-4 sm:grid-cols-[16rem_1fr] sm:gap-6">
                  <dt className="font-mono text-sm text-brand-200">{item.name}</dt>
                  <dd className="text-sm text-zinc-400">{item.detail}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/login">
                  Abrir a demo <ArrowRight />
                </Link>
              </Button>
              <span className="font-mono text-xs text-zinc-500">conta demo com dados de exemplo · sem cadastro</span>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
