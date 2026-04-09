import { motion } from 'framer-motion'

const STAGES = [
  {
    art: `\
      ,
      |
  ____|____
 |         |
 |_________|`,
    label: 'Day one. A seed.',
  },
  {
    art: `\
    \\ , /
     \\|/
      |
  ____|____
 |         |
 |_________|`,
    label: 'First leaves.',
  },
  {
    art: `\
     (-)
      |
      |
  ____|____
 |         |
 |_________|`,
    label: 'A bud.',
  },
  {
    art: `\
    ,--,
   ( ** )
    '--'
      |
      |
  ____|____
 |         |
 |_________|`,
    label: 'Opening up.',
  },
  {
    art: `\
    ,--.
   / ** \\
  | *  * |
   \\ ** /
    '--'
      |
  (   |   )
      |
  ____|____
 |         |
 |_________|`,
    label: 'Looking healthy.',
  },
  {
    art: `\
    ,---.
   / *** \\
  | * O * |
  | ***** |
   \\ *** /
    '---'
      |
  (   |   )
  (   |   )
      |
  ____|____
 |         |
 |_________|`,
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
  const milestones = [2, 5, 10, 20, 35]
  return milestones.find(m => m > streak) ?? null
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

      <div className="py-8 px-6 flex flex-col items-center" style={{ background: 'var(--surface)' }}>
        <pre
          className="text-center select-none"
          style={{
            fontFamily: 'monospace',
            fontSize: '1rem',
            lineHeight: '1.6',
            color: 'var(--primary)',
          }}
        >
          {stage.art}
        </pre>

        {next && (
          <p
            className="mt-6 text-xs"
            style={{ color: 'var(--text-faint)', fontFamily: 'Work Sans, sans-serif' }}
          >
            {next - streak} more day{next - streak !== 1 ? 's' : ''} until next growth
          </p>
        )}
      </div>
    </motion.div>
  )
}
