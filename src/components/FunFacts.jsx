import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

function SkeletonLine({ width = 'w-full' }) {
  return (
    <div
      className={`h-3 ${width} rounded-full animate-pulse`}
      style={{ background: 'var(--surface-mid)' }}
    />
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-faint)', fontFamily: 'Work Sans, sans-serif' }}>
        Asking Claude for the good stuff...
      </p>
      <SkeletonLine />
      <SkeletonLine width="w-5/6" />
      <SkeletonLine width="w-4/6" />
      <div className="pt-2" />
      <SkeletonLine />
      <SkeletonLine width="w-3/4" />
      <div className="pt-2" />
      <SkeletonLine width="w-5/6" />
      <SkeletonLine width="w-2/3" />
    </div>
  )
}

export default function FunFacts({ text, loading, error }) {
  return (
    <div>
      {error ? (
        <p className="text-sm" style={{ color: '#b02500' }}>
          Couldn't load: {error}. Check your API key.
        </p>
      ) : loading && !text ? (
        <LoadingSkeleton />
      ) : (
        <div className="prose-custom text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          <ReactMarkdown
            components={{
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {text}
          </ReactMarkdown>
          {loading && (
            <span
              className="inline-block w-1.5 h-4 rounded-sm animate-pulse ml-0.5 align-middle"
              style={{ background: 'var(--primary)' }}
            />
          )}
        </div>
      )}
    </div>
  )
}
