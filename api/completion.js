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
    try {
      const raw = await redis.lrange('completions', 0, 499)
      const completions = raw.map(item =>
        typeof item === 'string' ? JSON.parse(item) : item
      )
      return new Response(JSON.stringify({ completions }), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const { id, front, back, tags } = await req.json()
      const now = new Date()
      const entry = {
        id,
        date: now.toISOString().slice(0, 10),
        completedAt: now.toISOString(),
        front,
        back,
        tags: tags ?? [],
      }
      await redis.lpush('completions', JSON.stringify(entry))
      return new Response(JSON.stringify({ ok: true, date: entry.date }), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  return new Response('Method not allowed', { status: 405 })
}
