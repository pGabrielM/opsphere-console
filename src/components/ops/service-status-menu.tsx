'use client'

import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { setServiceStatus } from '@/lib/actions'
import { serviceStatusDot, serviceStatusLabel } from '@/lib/constants'
import { useAction } from '@/lib/use-action'
import { cn } from '@/lib/utils'

type Status = keyof typeof serviceStatusLabel

export function ServiceStatusMenu({ serviceId, status }: { serviceId: string; status: Status }) {
  const { pending, run } = useAction()
  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        disabled={pending}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50"
      >
        <span className={cn('size-2 rounded-full', serviceStatusDot[status])} />
        {serviceStatusLabel[status]}
        <ChevronDown className="size-4 text-zinc-400" />
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content align="end" sideOffset={6} className="z-50 w-48 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg">
          {(Object.keys(serviceStatusLabel) as Status[]).map((value) => (
            <Dropdown.Item
              key={value}
              onSelect={() => run(() => setServiceStatus(serviceId, value), { success: 'Status atualizado.' })}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-zinc-700 outline-none data-[highlighted]:bg-zinc-100"
            >
              <span className={cn('size-2 rounded-full', serviceStatusDot[value])} />
              {serviceStatusLabel[value]}
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  )
}
