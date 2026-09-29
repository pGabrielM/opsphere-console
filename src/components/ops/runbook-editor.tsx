'use client'

import { useState } from 'react'
import { Markdown } from '@/components/ops/markdown'
import { Button } from '@/components/ui/button'
import { Input, Label, Select } from '@/components/ui/input'
import { saveRunbook } from '@/lib/actions'
import { useAction } from '@/lib/use-action'
import { cn } from '@/lib/utils'

const TEMPLATE = `## Quando usar\n\nDescreva o sintoma ou alerta que leva a este procedimento.\n\n## Pré-requisitos\n\n- Acesso VPN\n- Permissão de deploy\n\n## Passos\n\n1. \n2. \n3. \n\n## Como validar\n\n- \n\n## Escalonamento\n\nSe não resolver em 15 minutos, acione o plantão da equipe responsável.\n`

type Props = {
  services: { id: string; name: string }[]
  runbook?: { id: string; title: string; content: string; serviceId: string | null }
  defaultServiceId?: string
}

export function RunbookEditor({ services, runbook, defaultServiceId }: Props) {
  const [content, setContent] = useState(runbook?.content ?? TEMPLATE)
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const { pending, run } = useAction()

  return (
    <form className="space-y-4" action={(formData) => run(() => saveRunbook(runbook?.id ?? null, formData))}>
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <div>
          <Label htmlFor="rb-title">Título</Label>
          <Input id="rb-title" name="title" defaultValue={runbook?.title} placeholder="Como fazer rollback da API" required />
        </div>
        <div>
          <Label htmlFor="rb-service">Serviço</Label>
          <Select id="rb-service" name="serviceId" defaultValue={runbook?.serviceId ?? defaultServiceId ?? ''}>
            <option value="">Geral</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div className="flex border-b border-zinc-100 bg-zinc-50 px-2">
          {(['write', 'preview'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn('border-b-2 px-3 py-2 text-sm font-medium', tab === key ? 'border-brand-600 text-brand-700' : 'border-transparent text-zinc-500')}
            >
              {key === 'write' ? 'Escrever' : 'Pré-visualizar'}
            </button>
          ))}
          <span className="ml-auto self-center pr-2 text-xs text-zinc-400">Markdown + tabelas + checklists</span>
        </div>
        <textarea
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={22}
          aria-label="Conteúdo em Markdown"
          className={cn('block w-full resize-y p-4 font-mono text-[13px] leading-relaxed text-zinc-800 focus:outline-none', tab !== 'write' && 'hidden')}
        />
        {tab === 'preview' && (
          <div className="min-h-[28rem] p-6">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? 'Salvando…' : 'Salvar runbook'}
        </Button>
      </div>
    </form>
  )
}
