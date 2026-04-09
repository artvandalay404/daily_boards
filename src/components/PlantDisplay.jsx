import { motion } from 'framer-motion'

const STAGES = [
  {
    // Day 1 — seedling
    art: `
    ,
    ;
  [___]`,
    label: 'A seedling. Day one.',
  },
  {
    // Day 2–4 — first leaves
    art: `
  \\   /
   \\ /
    ;
  [___]`,
    label: 'First leaves.',
  },
  {
    // Day 5–9 — small plant
    art: `
  \\ | /
  -\\;/-
    |
  [_____]`,
    label: 'Getting somewhere.',
  },
  {
    // Day 10–19 — branching out
    art: `
  \\ \\|/ /
   \\\\|//
    \\|/
     |
  [_______]`,
    label: 'Looking healthy.',
  },
  {
    // Day 20–34 — tall plant
    art: `
   (   )
  ( ( ) )
  (  |  )
   \\ | /
    \\|/
     |
  [_________]`,
    label: 'Thriving.',
  },
  {
    // Day 35+ — full tree
    art: `
    (   )
  ((     ))
 (( (   ) ))
  ((  | ) )
    \\\\|//
     \\|/
      |
  [___________]`,
    label: 'Fully grown.',
  },
]

function getStage(streak) {
  if (streak >= 35) return 5
  if (streak >= 20) return 4
  if (streak >= 10) return 3
  if (streak >= 5)  return 2
  if (streak >= 2)  return 1
  return 0
}

function getNextMilestone(streak) {
  if (streak >= 35) return null
  const milestones = [2, 5, 10, 20, 35]
  const next = milestones.find(m => m > streak)
  return next
}

export default function PlantDisplay({ streak }) {
  const stageIndex = getStage(streak)
  const stage = STAGES[stageIndex]
  const next = getNextMilestone(streak)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="rounded-3xl overflow-hidden mb-6"
      style={{ background: 'var(--surface-low)' }}
    >
      <div
        className="px-6 py-4"
        style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dim) 100%)' }}
      >
        <h2 className="font-extrabold text-lg" style={{ color: 'var(--on-primary)' }}>
          Your Plant
        </h2>
        <p className="text-sm mt-0.5 opacity-80" style={{ color: 'var(--on-primary)', fontFamily: 'Work Sans, sans-serif' }}>
          {streak} day streak — {stage.label}
        </p>
      </div>

      <div className="p-6 flex flex-col items-center" style={{ background: 'var(--surface)' }}>
        <pre
          className="text-center leading-relaxed select-none"
          style={{
            fontFamily: 'monospace',
            fontSize: '1.1rem',
            color: 'var(--primary)',
            lineHeight: '1.4',
          }}
        >
          {stage.art}
        </pre>

        {next && (
          <p
            className="mt-6 text-xs text-center"
            style={{ color: 'var(--text-faint)', fontFamily: 'Work Sans, sans-serif' }}
          >
            {next - streak} more day{next - streak !== 1 ? 's' : ''} until next growth
          </p>
        )}
      </div>
    </motion.div>
  )
}
