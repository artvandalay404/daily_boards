export default function StreakBadge({ streak }) {
  return (
    <div className="flex mb-6 pl-1">
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm"
        style={{
          background: 'var(--primary-container)',
          color: 'var(--primary)',
          fontFamily: 'Work Sans, sans-serif',
        }}
      >
        <span>
          {streak} day{streak !== 1 ? 's' : ''} in a row
        </span>
      </div>
    </div>
  )
}
