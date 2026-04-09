# Samhi's Daily Step 1 Card — PRD

## What is this?

A fun, colorful single-page web app that picks one high-yield USMLE Step 1 flashcard from the AnKing v11 deck each day and displays it with AI-generated fun facts and links to interesting research articles. Makes daily review feel like discovery, not a grind.

---

## Core Features

### 1. Daily Card
- One card per day, seeded by date so Samhi sees the same card all day regardless of refresh
- Pulled from a curated subset of AnKing v11 tagged `#AK_Step1_v11::` with high-yield tags (e.g. `HY`, `Pixorize`, `OME`)
- Shows the front (question/prompt) first, with a "Reveal Answer" button
- Card content rendered with basic HTML (AnKing cards use HTML formatting)

### 2. AI Fun Facts Panel
- After revealing the answer, a panel loads with Claude-generated content:
  - 2–3 fun/surprising facts about the topic
  - A memorable clinical pearl or mnemonic
  - 1–2 links to real, interesting research articles or explainers (PubMed, NEJM, etc.)
- Claude is called client-side via the Anthropic API using the card's front+back as context
- Fun, conversational tone — not a textbook

### 3. Personalization
- Greeting uses Samhi's name ("Good morning, Samhi! Here's your card for today 🎉")
- Greeting changes by time of day (morning / afternoon / evening)
- Streak counter: tracks how many days in a row she's opened the app (stored in localStorage)

### 4. Visual Design
- Fun and colorful — bold gradients, rounded cards, playful typography
- Confetti animation when the answer is revealed
- Mobile-first, fully responsive
- Dark mode support

---

## Card Data

AnKing v11 is distributed as an `.apkg` file (SQLite database). The build step should:

1. Download or import the AnKing v11 `.apkg`
2. Extract cards using Python + raw SQLite
3. Filter to high-yield cards by tag (e.g. `AK_Step1_v11::!flag_these_cards::QuesGen::HY_USMLE_STEP_1` or similar)
4. Export as a static `cards.json` array with fields: `{ id, front, back, tags }`
5. Commit `cards.json` to the repo — no runtime database needed

> The `.apkg` file is not redistributable, so `cards.json` should be gitignored if the repo is public.

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | React (Vite) | Fast dev experience, easy deploy |
| Styling | Tailwind CSS | Utility-first, easy responsive |
| AI | Anthropic API (`claude-sonnet-4-20250514`) | Client-side fetch, streamed response |
| Hosting | Vercel or Netlify | Free tier, one-click deploy |
| Storage | localStorage | Streak counter, revealed state |
| Card data | Static `cards.json` | Generated at build time from `.apkg` |

---

## API Key Handling

Since this is a personal/gift app (not public), the Anthropic API key can be stored in a `.env` file (`VITE_ANTHROPIC_API_KEY`) and baked into the build. Add a note in the README that the key should be rotated if the app is ever shared publicly.

---

## Card Selection Logic

```
seed = YYYY-MM-DD string (today's date)
index = deterministicHash(seed) % cards.length
todaysCard = cards[index]
```

Use a simple hash function (e.g. FNV-1a) so the same date always returns the same card across devices without needing a backend.

---

## Claude Prompt (Fun Facts Panel)

```
You are a fun, enthusiastic medical tutor helping a medical student named Samhi 
study for USMLE Step 1. 

Given this flashcard:
FRONT: {front}
BACK: {back}

Generate:
1. Two or three genuinely surprising or delightful fun facts about this topic 
   (things she might not know from the card alone)
2. One memorable mnemonic or clinical pearl
3. One or two links to real, interesting articles (PubMed, NEJM, Nature, etc.) 
   — only include links you are confident exist

Keep it conversational, warm, and a little playful. Use Samhi's name once.
Format with clear sections. Do not use excessive jargon.
```

---

## Screens

### Main screen (before reveal)
- Greeting + date + streak badge
- Card front in a colorful card component
- "Reveal Answer 🎉" button

### Main screen (after reveal)
- Card front + back both visible
- Confetti burst animation
- Fun Facts panel streams in below
- "Copy card" button (copies front+back to clipboard)

### Loading state
- Skeleton loaders for the fun facts panel
- Friendly copy: "Asking Claude for the good stuff..."

---

## Out of Scope (v1)

- User accounts / auth
- Full spaced repetition / scheduling
- Syncing with AnkiWeb
- Multiple decks or subjects

---

## Success Criteria

- Samhi opens it at least a few times a week
- She learns something surprising from the fun facts at least once
- It doesn't feel like studying
