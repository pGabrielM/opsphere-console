import { BookOpen, Plus } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/shell/page-header'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { teamDot } from '@/lib/constants'
import { relative } from '@/lib/format'
import { getRunbooks } from '@/lib/queries'
import { requireUser } from '@/lib/session'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Runbooks' }

export default async function RunbooksPage() {
  const user = await requireUser()
  const runbooks = await getRunbooks(user.id)
  const newButton = (
    <Button asChild>
      <Link href="/app/runbooks/new">
        <Plus /> Novo runbook
      </Link>
    </Button>
  )

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Runbooks" description="Procedimentos passo a passo para operar e recuperar cada serviço." actions={newButton} />
      {runbooks.length === 0 ? (
        <EmptyState icon={BookOpen} title="Nenhum runbook" description="Documente como diagnosticar e resolver problemas recorrentes." action={newButton} />
      ) : (
        <ul className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          {runbooks.map((runbook) => (
            <li key={runbook.id}>
              <Link href={`/app/runbooks/${runbook.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <BookOpen className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-900">{runbook.title}</p>
                  <p className="flex items-center gap-1.5 truncate text-xs text-zinc-500">
                    {runbook.service?.team && <span className={cn('size-1.5 rounded-full', teamDot(runbook.service.team.color))} />}
                    {runbook.service ? runbook.service.name : 'Geral'}
                    {' · '}
                    {runbook.content.split('\n').length} linhas
                  </p>
                </div>
                <span className="hidden text-xs text-zinc-400 sm:block">atualizado {relative(runbook.updatedAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
