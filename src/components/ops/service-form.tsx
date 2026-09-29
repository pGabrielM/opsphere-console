'use client'

import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input, Label, Select, Textarea } from '@/components/ui/input'
import { saveService } from '@/lib/actions'
import { tierLabel, type ServiceLink } from '@/lib/constants'
import { useAction } from '@/lib/use-action'

type ServiceValues = {
  id: string
  name: string
  description: string | null
  teamId: string | null
  tier: 'CRITICAL' | 'HIGH' | 'STANDARD'
  status: string
  tags: string[]
  links: ServiceLink[]
}

export function ServiceForm({ teams, service }: { teams: { id: string; name: string }[]; service?: ServiceValues }) {
  const [open, setOpen] = useState(false)
  const { pending, run } = useAction()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {service ? (
          <Button variant="secondary">
            <Pencil /> Editar
          </Button>
        ) : (
          <Button>
            <Plus /> Novo serviço
          </Button>
        )}
      </DialogTrigger>
      <DialogContent title={service ? 'Editar serviço' : 'Novo serviço'} className="max-w-xl">
        <form
          className="space-y-4"
          action={(formData) =>
            run(() => saveService(service?.id ?? null, formData), { success: service ? 'Serviço atualizado.' : undefined, onSuccess: () => setOpen(false) })
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="svc-name">Nome</Label>
              <Input id="svc-name" name="name" defaultValue={service?.name} placeholder="API de pagamentos" required />
            </div>
            <div>
              <Label htmlFor="svc-team">Equipe responsável</Label>
              <Select id="svc-team" name="teamId" defaultValue={service?.teamId ?? ''}>
                <option value="">Sem equipe</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="svc-tier">Criticidade</Label>
              <Select id="svc-tier" name="tier" defaultValue={service?.tier ?? 'STANDARD'}>
                {Object.entries(tierLabel).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <input type="hidden" name="status" value={service?.status ?? 'OPERATIONAL'} />
          <div>
            <Label htmlFor="svc-description">Descrição</Label>
            <Textarea id="svc-description" name="description" rows={3} defaultValue={service?.description ?? ''} placeholder="O que o serviço faz, quem usa, dependências…" />
          </div>
          <div>
            <Label htmlFor="svc-links">Links (um por linha: Nome | URL)</Label>
            <Textarea
              id="svc-links"
              name="links"
              rows={4}
              className="font-mono text-xs"
              defaultValue={service?.links.map((link) => `${link.label} | ${link.url}`).join('\n')}
              placeholder={'Produção | https://app.empresa.com\nDashboard | https://grafana.empresa.com/d/api\nRepositório | https://github.com/empresa/api'}
            />
          </div>
          <div>
            <Label htmlFor="svc-tags">Tags (separadas por vírgula)</Label>
            <Input id="svc-tags" name="tags" defaultValue={service?.tags.join(', ')} placeholder="laravel, postgres, pagamentos" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Salvando…' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
