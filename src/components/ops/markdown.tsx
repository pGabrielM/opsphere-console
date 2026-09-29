import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// react-markdown escapes raw HTML by default, so runbook content can't inject scripts.
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-ops">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: label }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {label}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
