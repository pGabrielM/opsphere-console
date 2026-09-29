'use client'

import { Command } from 'cmdk'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { BookOpen, Search, Server, Siren } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { search, type SearchHit } from '@/lib/actions'

const icons = { service: Server, runbook: BookOpen, incident: Siren }
const groups = { service: 'Serviços', runbook: 'Runbooks', incident: 'Incidentes' } as const

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<SearchHit[]>([])
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const handle = setTimeout(() => {
      startTransition(async () => setHits(query.trim().length >= 2 ? await search(query) : []))
    }, 180)
    return () => clearTimeout(handle)
  }, [query])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 w-full max-w-sm items-center gap-2 rounded-md border border-zinc-300 bg-zinc-50 px-3 text-[13px] text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-white"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Buscar serviços, runbooks…</span>
        <kbd className="hidden rounded border border-zinc-200 bg-white px-1.5 font-mono text-[11px] text-zinc-500 sm:inline">Ctrl K</kbd>
      </button>
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-[2px]" />
          <DialogPrimitive.Content className="fixed top-[15vh] left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl focus:outline-none">
            <DialogPrimitive.Title className="sr-only">Busca global</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">Busque serviços, runbooks e incidentes</DialogPrimitive.Description>
            <Command shouldFilter={false} label="Busca global">
              <div className="flex items-center gap-2 border-b border-zinc-100 px-4">
                <Search className="size-4 text-zinc-400" />
                <Command.Input
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Digite para buscar em todo o workspace…"
                  className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
                />
                {pending && <span className="size-3 animate-spin rounded-full border-2 border-zinc-300 border-t-brand-600" />}
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="px-3 py-8 text-center text-sm text-zinc-500">
                  {query.trim().length < 2 ? 'Digite pelo menos 2 letras.' : 'Nada encontrado.'}
                </Command.Empty>
                {(Object.keys(groups) as (keyof typeof groups)[]).map((type) => {
                  const items = hits.filter((hit) => hit.type === type)
                  if (!items.length) return null
                  const Icon = icons[type]
                  return (
                    <Command.Group key={type} heading={groups[type]} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-400">
                      {items.map((hit) => (
                        <Command.Item
                          key={`${hit.type}-${hit.id}`}
                          value={`${hit.type}-${hit.id}`}
                          onSelect={() => {
                            setOpen(false)
                            setQuery('')
                            router.push(hit.href)
                          }}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm data-[selected=true]:bg-brand-50"
                        >
                          <Icon className="size-4 text-zinc-400" />
                          <span className="flex-1 truncate text-zinc-900">{hit.title}</span>
                          <span className="truncate text-xs text-zinc-500">{hit.subtitle}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )
                })}
              </Command.List>
            </Command>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  )
}
