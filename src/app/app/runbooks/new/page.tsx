import type { Metadata } from 'next'
import { RunbookEditor } from '@/components/ops/runbook-editor'
import { PageHeader } from '@/components/shell/page-header'
import { getServiceOptions } from '@/lib/queries'
import { requireUser } from '@/lib/session'

export const metadata: Metadata = { title: 'Novo runbook' }

export default async function NewRunbookPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const user = await requireUser()
  const services = await getServiceOptions(user.id)
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Novo runbook" description="Um bom runbook permite que qualquer pessoa do plantão resolva o problema sem improvisar." />
      <RunbookEditor services={services} defaultServiceId={(await searchParams).service} />
    </div>
  )
}
