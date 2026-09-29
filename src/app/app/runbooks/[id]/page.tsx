import { ArrowLeft, Pencil } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ConfirmButton } from '@/components/confirm-button'
import { Markdown } from '@/components/ops/markdown'
import { Button } from '@/components/ui/button'
import { deleteRunbook } from '@/lib/actions'
import { formatDate } from '@/lib/format'
import { getRunbook } from '@/lib/queries'
import { requireUser } from '@/lib/session'

export const metadata: Metadata = { title: 'Runbook' }

export default async function RunbookPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const runbook = await getRunbook(user.id, (await params).id)
  if (!runbook) notFound()

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/app/runbooks" className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800">
        <ArrowLeft className="size-4" /> Runbooks
      </Link>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{runbook.title}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {runbook.service ? (
              <Link href={`/app/services/${runbook.service.id}`} className="font-medium text-brand-700 hover:underline">
                {runbook.service.name}
              </Link>
            ) : (
              'Geral'
            )}
            {' · '}atualizado em {formatDate(runbook.updatedAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href={`/app/runbooks/${runbook.id}/edit`}>
              <Pencil /> Editar
            </Link>
          </Button>
          <ConfirmButton compact title="Excluir runbook?" description="O procedimento será apagado." action={deleteRunbook.bind(null, runbook.id)} />
        </div>
      </div>
      <article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <Markdown>{runbook.content}</Markdown>
      </article>
    </div>
  )
}
