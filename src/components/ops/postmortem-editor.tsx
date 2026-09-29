'use client'

import { FileText, Pencil } from 'lucide-react'
import { useState } from 'react'
import { Markdown } from '@/components/ops/markdown'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { savePostmortem } from '@/lib/actions'
import { useAction } from '@/lib/use-action'

const TEMPLATE = `## Resumo\n\n## Impacto\n\n## Linha do tempo\n\n## Causa raiz\n\n## O que funcionou\n\n## Ações de melhoria\n\n- [ ] \n`

export function PostmortemEditor({ incidentId, value }: { incidentId: string; value: string | null }) {
  const [editing, setEditing] = useState(false)
  const { pending, run } = useAction()

  if (!editing) {
    return value ? (
      <div>
        <div className="mb-3 flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <Pencil /> Editar
          </Button>
        </div>
        <Markdown>{value}</Markdown>
      </div>
    ) : (
      <div className="py-6 text-center">
        <FileText className="mx-auto size-8 text-zinc-300" />
        <p className="mt-2 text-sm text-zinc-500">Documente causa raiz e ações de melhoria.</p>
        <Button variant="secondary" size="sm" className="mt-4" onClick={() => setEditing(true)}>
          Escrever post-mortem
        </Button>
      </div>
    )
  }

  return (
    <form action={(formData) => run(() => savePostmortem(incidentId, formData), { success: 'Post-mortem salvo.', onSuccess: () => setEditing(false) })}>
      <Textarea name="postmortem" rows={16} defaultValue={value ?? TEMPLATE} className="font-mono text-xs" aria-label="Post-mortem em Markdown" />
      <div className="mt-3 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          Salvar
        </Button>
      </div>
    </form>
  )
}
