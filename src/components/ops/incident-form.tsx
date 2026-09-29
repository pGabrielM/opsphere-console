'use client'

import { Siren } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input, Label, Select, Textarea } from '@/components/ui/input'
import { createIncident } from '@/lib/actions'
import { severityLabel } from '@/lib/constants'
import { useAction } from '@/lib/use-action'

export function IncidentForm({ services, preselected }: { services: { id: string; name: string }[]; preselected?: string }) {
  const [open, setOpen] = useState(false)
  const { pending, run } = useAction()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="danger">
          <Siren /> Declarar incidente
        </Button>
      </DialogTrigger>
      <DialogContent title="Declarar incidente" description="Os serviços afetados mudam de status automaticamente até a resolução." className="max-w-xl">
        <form className="space-y-4" action={(formData) => run(() => createIncident(formData), { onSuccess: () => setOpen(false) })}>
          <div>
            <Label htmlFor="inc-title">O que está acontecendo?</Label>
            <Input id="inc-title" name="title" placeholder="Checkout retornando erro 500 para parte dos clientes" required />
          </div>
          <div>
            <Label htmlFor="inc-severity">Severidade</Label>
            <Select id="inc-severity" name="severity" defaultValue="SEV2">
              {Object.entries(severityLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <fieldset>
            <legend className="field-label">Serviços afetados</legend>
            <div className="grid max-h-44 gap-1 overflow-y-auto rounded-lg border border-zinc-200 p-2 sm:grid-cols-2">
              {services.map((service) => (
                <label key={service.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-50">
                  <input type="checkbox" name="serviceIds" value={service.id} defaultChecked={service.id === preselected} className="size-4 accent-brand-600" />
                  <span className="truncate">{service.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <Label htmlFor="inc-message">Primeira atualização</Label>
            <Textarea id="inc-message" name="message" rows={3} placeholder="Recebemos alertas às 14h02. Investigando logs da API…" required />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="danger" disabled={pending}>
              {pending ? 'Declarando…' : 'Declarar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
