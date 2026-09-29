import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RunbookEditor } from '@/components/ops/runbook-editor'
import { PageHeader } from '@/components/shell/page-header'
import { getRunbook, getServiceOptions } from '@/lib/queries'
import { requireUser } from '@/lib/session'

export const metadata: Metadata = { title: 'Editar runbook' }

export default async function EditRunbookPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const [runbook, services] = await Promise.all([getRunbook(user.id, (await params).id), getServiceOptions(user.id)])
  if (!runbook) notFound()
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Editar runbook" />
      <RunbookEditor services={services} runbook={runbook} />
    </div>
  )
}
