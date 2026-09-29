'use client'

import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input, Label } from '@/components/ui/input'
import { saveTeam } from '@/lib/actions'
import { TEAM_COLORS } from '@/lib/constants'
import { useAction } from '@/lib/use-action'
import { cn } from '@/lib/utils'

export function TeamForm({ team }: { team?: { id: string; name: string; color: string } }) {
  const [open, setOpen] = useState(false)
  const [color, setColor] = useState(team?.color ?? 'sky')
  const { pending, run } = useAction()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {team ? (
          <Button variant="ghost" size="icon" aria-label="Editar equipe">
            <Pencil />
          </Button>
        ) : (
          <Button>
            <Plus /> Nova equipe
          </Button>
        )}
      </DialogTrigger>
      <DialogContent title={team ? 'Editar equipe' : 'Nova equipe'} description="Equipes são donas dos serviços do catálogo.">
        <form
          className="space-y-4"
          action={(formData) => run(() => saveTeam(team?.id ?? null, formData), { success: 'Equipe salva.', onSuccess: () => setOpen(false) })}
        >
          <div>
            <Label htmlFor="team-name">Nome</Label>
            <Input id="team-name" name="name" defaultValue={team?.name} placeholder="Ex.: Infraestrutura" required />
          </div>
          <div>
            <span className="field-label">Cor</span>
            <input type="hidden" name="color" value={color} />
            <div className="flex gap-2">
              {Object.entries(TEAM_COLORS).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  aria-label={key}
                  onClick={() => setColor(key)}
                  className={cn('size-7 rounded-full ring-offset-2', value, color === key ? 'ring-2 ring-zinc-900' : 'hover:scale-110')}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
