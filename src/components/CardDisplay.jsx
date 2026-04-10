import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CLOZE_RE = /\{\{c\d+::(.*?)(?:::.*?)?\}\}/g

function sanitizeCardHtml(html, isQuestion, hiddenIdx) {
  let i = 0
  return html.replace(CLOZE_RE, (_, answer) => {
    const isHidden = i++ === hiddenIdx
    if (isQuestion) {
      return isHidden ? '(?)' : answer
    }
    // revealed: highlight only the one that was hidden
    return isHidden
      ? `<span class="font-bold" style="color: var(--primary)">${answer}</span>`
      : answer
  })
}

function SectionLabel({ children, color }) {
  return (
    <span
      className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
      style={{
        background: color === 'primary' ? 'var(--primary-container)' : 'var(--secondary-container)',
        color: color === 'primary' ? 'var(--primary)' : 'var(--secondary)',
        fontFamily: 'Work Sans, sans-serif',
        letterSpacing: '0.1em',
      }}
    >
      {children}
    </span>
  )
}

export default function CardDisplay({ card, revealed }) {
  const hiddenIdx = useMemo(() => {
    const matches = [...card.front.matchAll(CLOZE_RE)]
    if (matches.length === 0) return 0
    return Math.floor(Math.random() * matches.length)
  }, [card.id])

  return (
    <div className="rounded-3xl overflow-hidden mb-4" style={{ background: 'var(--surface-low)' }}>
      {/* Top accent bar */}
      <div
        className="h-1.5"
        style={{ background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-container) 100%)' }}
      />

      {/* Question — blanks filled in once revealed */}
      <div className="p-6" style={{ background: 'var(--surface)' }}>
        <SectionLabel color="primary">Question</SectionLabel>
        <div
          className="card-content text-base leading-relaxed overflow-x-auto"
          style={{ color: 'var(--text)', fontFamily: 'Work Sans, sans-serif' }}
          dangerouslySetInnerHTML={{ __html: sanitizeCardHtml(card.front, !revealed, hiddenIdx) }}
        />
      </div>

      {/* Extra info from back of card */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="px-6 pb-6"
            style={{ background: 'var(--surface)' }}
          >
            <div
              className="card-content text-sm leading-relaxed pt-4 overflow-x-auto"
              style={{
                color: 'var(--text-muted)',
                fontFamily: 'Work Sans, sans-serif',
                borderTop: '1px solid var(--surface-mid)',
              }}
              dangerouslySetInnerHTML={{ __html: sanitizeCardHtml(card.back, false, hiddenIdx) }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topic chips */}
      {card.tags?.length > 0 && (
        <div
          className="px-6 py-3 flex flex-wrap gap-2 items-center"
          style={{ background: 'var(--surface-mid)' }}
        >
          <span
            className="text-xs font-semibold mr-1"
            style={{ color: 'var(--text-faint)', fontFamily: 'Work Sans, sans-serif' }}
          >
            Topics:
          </span>
          {card.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs rounded-full px-2.5 py-0.5 truncate max-w-[180px]"
              style={{
                background: 'var(--surface)',
                color: 'var(--text-muted)',
                fontFamily: 'Work Sans, sans-serif',
              }}
              title={tag}
            >
              {tag.split('::').pop()}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
