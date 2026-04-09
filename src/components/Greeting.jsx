export default function Greeting() {
  const hour = new Date().getHours()
  let greeting

  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning, Samhi.'
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Hey Samhi.'
  } else if (hour >= 17 && hour < 22) {
    greeting = 'Evening, Samhi.'
  } else {
    greeting = 'Still up, Samhi?'
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mb-6 pl-1">
      <p className="text-xs font-semibold uppercase tracking-widest mb-1"
         style={{ color: 'var(--primary)', fontFamily: 'Work Sans, sans-serif', letterSpacing: '0.12em' }}>
        {today}
      </p>
      <h1 className="text-3xl font-extrabold leading-tight" style={{ color: 'var(--text)' }}>
        {greeting}
      </h1>
      <p className="text-sm mt-1 font-medium" style={{ color: 'var(--text-muted)', fontFamily: 'Work Sans, sans-serif' }}>
        Here's your high-yield card for today.
      </p>
    </div>
  )
}
