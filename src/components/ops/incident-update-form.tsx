'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Select, Textarea } from '@/components/ui/input'
import { postIncidentUpdate } from '@/lib/actions'
import { incidentStatusLabel } from '@/lib/constants'
import { useAction } from '@/lib/use-action'

export function IncidentUpdateForm({ incidentId, status }: { incidentId: string; status: keyof typeof incidentStatusLabel }) {
  const { pending, run } = useAction()
  const formRef = useRef<HTMLFormElement>(null)
  return (
    <form
      ref={formRef}
      className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4"
      action={(formData) =>
        run(() => postIncidentUpdate(incidentId, formData), { success: 'Atualização publicada.', onSuccess: () => formRef.current?.reset() })
      }
    >
      <Textarea name="message" rows={3} placeholder="Nova atualização: o que mudou, próximos passos…" aria-label="Mensagem" required />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Select name="status" defaultValue={status} aria-label="Status" className="w-auto">
          {Object.entries(incidentStatusLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Button type="submit" disabled={pending}>
          {pending ? 'Publicando…' : 'Publicar atualização'}
        </Button>
      </div>
    </form>
  )
}
