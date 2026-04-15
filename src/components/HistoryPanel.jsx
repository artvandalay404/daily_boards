import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const stripHtml = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
const stripCloze = (text) => text.replace(/\{\{c\d+::(.*?)(?:::.*?)?\}\}/g, '$1')

function sanitizeForReview(html) {
  // In review mode always show full answers (no blanks)
  return html.replace(
    /\{\{c\d+::(.*?)(?:::.*?)?\}\}/g,
    '<span class="font-bold" style="color: var(--primary)">$1</span>'
  )
}

function formatGroupDate(isoDate) {
  const d = new Date(isoDate + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function SkeletonLine({ width = 'w-full' }) {
  return (
    <div
      className={`h-3 ${width} rounded-full animate-pulse`}
      style={{ background: 'var(--surface-mid)' }}
    />
  )
}

function HistoryCard({ entry }) {
  const [expanded, setExpanded] = useState(false)
  const plainFront = stripCloze(stripHtml(entry.front))
  const truncated = plainFront.length > 120 ? plainFront.slice(0, 120) + '…' : plainFront
  const topTags = (entry.tags ?? []).slice(0, 3).map(t => t.split('::').pop())

  return (
    <div
      className="rounded-2xl overflow-hidden mb-2"
      style={{ background: 'var(--surface)' }}
    >
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left px-4 py-3 flex items-start gap-3"
      >
        <div className="flex-1 min-w-0">
          <p
            className="text-sm leading-snug mb-1.5"
            style={{ color: 'var(--text)', fontFamily: 'Work Sans, sans-serif' }}
          >
            {truncated}
          </p>
          {topTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {topTags.map(tag => (
                <span
                  key={tag}
                  className="text-xs rounded-full px-2 py-0.5 truncate max-w-[140px]"
                  style={{ background: 'var(--surface-low)', color: 'var(--text-faint)', fontFamily: 'Work Sans, sans-serif' }}
                  title={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <span
          className="text-sm flex-shrink-0 mt-0.5 transition-transform duration-200"
          style={{
            color: 'var(--text-faint)',
            display: 'inline-block',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▾
        </span>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-4">
              <div
                className="pt-3 mb-3"
                style={{ borderTop: '1px solid var(--surface-mid)' }}
              >
                <span
                  className="inline-block text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2"
                  style={{ background: 'var(--primary-container)', color: 'var(--primary)', fontFamily: 'Work Sans, sans-serif' }}
                >
                  Question
                </span>
                <div
                  className="card-content text-sm leading-relaxed"
                  style={{ color: 'var(--text)', fontFamily: 'Work Sans, sans-serif' }}
                  dangerouslySetInnerHTML={{ __html: sanitizeForReview(entry.front) }}
                />
              </div>

              {entry.back && (
                <div
                  className="pt-3"
                  style={{ borderTop: '1px solid var(--surface-mid)' }}
                >
                  <div
                    className="card-content text-sm leading-relaxed"
                    style={{ color: 'var(--text-muted)', fontFamily: 'Work Sans, sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: sanitizeForReview(entry.back) }}
                  />
                </div>
              )}

              <button
                onClick={() => setExpanded(false)}
                className="mt-3 text-xs"
                style={{ color: 'var(--text-faint)', fontFamily: 'Work Sans, sans-serif', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Collapse ▲
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HistoryPanel({ isOpen, onClose, query, setQuery, grouped, loading, error, totalCount }) {
  const filteredCount = grouped.reduce((sum, g) => sum + g.items.length, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 40,
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '420px',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg)',
            }}
          >
            {/* Sticky header */}
            <div
              className="px-5 py-4 flex items-center justify-between flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dim) 100%)' }}
            >
              <div>
                <h2 className="font-extrabold text-lg" style={{ color: 'var(--on-primary)' }}>
                  History
                </h2>
                <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--on-primary)', fontFamily: 'Work Sans, sans-serif' }}>
                  {query.trim()
                    ? `Showing ${filteredCount} of ${totalCount}`
                    : `${totalCount} card${totalCount !== 1 ? 's' : ''} reviewed`}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close history"
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ color: 'var(--on-primary)', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {/* Sticky search */}
            <div className="px-4 py-3 flex-shrink-0" style={{ background: 'var(--surface-low)' }}>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search cards..."
                  aria-label="Search reviewed cards"
                  className="w-full rounded-2xl px-4 py-2.5 text-sm outline-none"
                  style={{
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    fontFamily: 'Work Sans, sans-serif',
                    border: '1px solid var(--surface-mid)',
                  }}
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                    style={{ color: 'var(--text-faint)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {loading ? (
                <div className="space-y-3 mt-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-2xl p-4 space-y-2" style={{ background: 'var(--surface)' }}>
                      <SkeletonLine />
                      <SkeletonLine width="w-3/4" />
                      <SkeletonLine width="w-1/2" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <p className="text-sm mt-4 text-center" style={{ color: 'var(--text-muted)', fontFamily: 'Work Sans, sans-serif' }}>
                  Couldn't load history. Try again.
                </p>
              ) : totalCount === 0 ? (
                <p className="text-sm mt-8 text-center leading-relaxed" style={{ color: 'var(--text-faint)', fontFamily: 'Work Sans, sans-serif' }}>
                  No cards reviewed yet —<br />reveal an answer to start tracking!
                </p>
              ) : grouped.length === 0 ? (
                <p className="text-sm mt-8 text-center" style={{ color: 'var(--text-faint)', fontFamily: 'Work Sans, sans-serif' }}>
                  No cards match your search.
                </p>
              ) : (
                grouped.map(({ date, items }) => (
                  <div key={date} className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <p
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: 'var(--text-faint)', fontFamily: 'Work Sans, sans-serif' }}
                      >
                        {formatGroupDate(date)}
                      </p>
                      <span
                        className="text-xs"
                        style={{ color: 'var(--text-faint)', fontFamily: 'Work Sans, sans-serif' }}
                      >
                        {items.length} done
                      </span>
                    </div>
                    {items.map(entry => (
                      <HistoryCard key={entry.id + entry.completedAt} entry={entry} />
                    ))}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
