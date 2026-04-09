export const config = { runtime: 'edge' }

import { Redis } from '@upstash/redis'

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN,
  })
}

export default async function handler(req) {
  const redis = getRedis()

  if (req.method === 'GET') {
    const [lastVisit, stored] = await Promise.all([
      redis.get('lastVisitDate'),
      redis.get('streakCount'),
    ])
    return new Response(JSON.stringify({ lastVisit, streak: parseInt(stored || '1', 10) }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (req.method === 'POST') {
    const today = new Date().toISOString().slice(0, 10)
    const [lastVisit, stored] = await Promise.all([
      redis.get('lastVisitDate'),
      redis.get('streakCount'),
    ])
    const storedCount = parseInt(stored || '0', 10)

    let newStreak = 1
    if (lastVisit === today) {
      newStreak = storedCount || 1
    } else if (lastVisit) {
      const yesterday = new Date()
      yesterday.setUTCDate(yesterday.getUTCDate() - 1)
      const yStr = yesterday.toISOString().slice(0, 10)
      newStreak = lastVisit === yStr ? (storedCount || 1) + 1 : 1
    }

    await Promise.all([
      redis.set('lastVisitDate', today),
      redis.set('streakCount', String(newStreak)),
    ])

    return new Response(JSON.stringify({ streak: newStreak }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response('Method not allowed', { status: 405 })
}
