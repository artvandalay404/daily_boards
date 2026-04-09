#!/usr/bin/env python3
"""
Usage: python scripts/extract_cards.py "AnKing V11 updated.apkg" public/cards.json
Requires: pip install beautifulsoup4
"""

import sqlite3, zipfile, json, sys, os, tempfile

HY_TAG_KEYWORDS = ["Step1", "HY", "Physeo", "Pixorize", "OME", "Pathoma"]


def extract(apkg_path, output_path):
    with tempfile.TemporaryDirectory() as tmpdir:
        print(f"Extracting {apkg_path}...")
        with zipfile.ZipFile(apkg_path, "r") as z:
            z.extractall(tmpdir)

        db_path = os.path.join(tmpdir, "collection.anki21")
        if not os.path.exists(db_path):
            db_path = os.path.join(tmpdir, "collection.anki2")
        if not os.path.exists(db_path):
            raise FileNotFoundError("Could not find Anki collection database in .apkg")

        print(f"Reading database: {os.path.basename(db_path)}")
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()

        cur.execute("SELECT id, flds, tags FROM notes")
        rows = cur.fetchall()
        print(f"Total notes in deck: {len(rows)}")

        cards = []
        for note_id, flds, tags in rows:
            if not any(kw in tags for kw in HY_TAG_KEYWORDS):
                continue
            fields = flds.split("\x1f")
            if len(fields) < 2:
                continue
            front = fields[0].strip()
            back = fields[1].strip()
            if not front or not back:
                continue
            cards.append(
                {
                    "id": str(note_id),
                    "front": front,
                    "back": back,
                    "tags": tags.strip().split(),
                }
            )

        conn.close()

        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(cards, f, ensure_ascii=False)

        print(f"✅ Extracted {len(cards)} high-yield cards → {output_path}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python scripts/extract_cards.py <apkg_path> <output_json>")
        sys.exit(1)
    extract(sys.argv[1], sys.argv[2])
