import { useState, useEffect, useCallback } from "react";

const STAGES = [
  {
    name: "Seed",
    art: [
      "              ",
      "              ",
      "              ",
      "              ",
      "              ",
      "              ",
      "    (  )      ",
      "   ( ·· )     ",
      "    (  )      ",
      "      |       ",
      "  ~~~~~~~~~~~  ",
      "  | |¯¯¯| | | ",
      "  |  _____  | ",
      "  | /     \\ | ",
      "   ¯¯¯¯¯¯¯¯¯  ",
    ],
  },
  {
    name: "Sprout",
    art: [
      "              ",
      "              ",
      "              ",
      "              ",
      "              ",
      "      |       ",
      "    ( |       ",
      "   (  |       ",
      "    ( |       ",
      "      |       ",
      "  ~~~~~~~~~~~  ",
      "  | |¯¯¯| | | ",
      "  |  _____  | ",
      "  | /     \\ | ",
      "   ¯¯¯¯¯¯¯¯¯  ",
    ],
  },
  {
    name: "Stem & thorns",
    art: [
      "              ",
      "              ",
      "              ",
      "      |       ",
      "      |       ",
      "    `-|       ",
      "      |       ",
      "      |-´     ",
      "      |       ",
      "      |       ",
      "  ~~~~~~~~~~~  ",
      "  | |¯¯¯| | | ",
      "  |  _____  | ",
      "  | /     \\ | ",
      "   ¯¯¯¯¯¯¯¯¯  ",
    ],
  },
  {
    name: "Leaves",
    art: [
      "              ",
      "              ",
      "      |       ",
      "      |       ",
      " \\\\   |       ",
      "  \\\\  |       ",
      "    `-|   //  ",
      "      |  //   ",
      "      |-´     ",
      "      |       ",
      "  ~~~~~~~~~~~  ",
      "  | |¯¯¯| | | ",
      "  |  _____  | ",
      "  | /     \\ | ",
      "   ¯¯¯¯¯¯¯¯¯  ",
    ],
  },
  {
    name: "Bud",
    art: [
      "              ",
      "    ,^^^,     ",
      "   ( ))) )    ",
      "    `---´     ",
      "      |       ",
      " \\\\   |       ",
      "  \\\\  |       ",
      "      |   //  ",
      "      |  //   ",
      "      |       ",
      "  ~~~~~~~~~~~  ",
      "  | |¯¯¯| | | ",
      "  |  _____  | ",
      "  | /     \\ | ",
      "   ¯¯¯¯¯¯¯¯¯  ",
    ],
  },
  {
    name: "Opening",
    art: [
      "   ,´  `,     ",
      "  ( ,^^, )    ",
      "  ((    ))    ",
      "   `-..-´     ",
      "      |       ",
      " \\\\   |       ",
      "  \\\\  |   //  ",
      "      |  //   ",
      "      |       ",
      "      |       ",
      "  ~~~~~~~~~~~  ",
      "  | |¯¯¯| | | ",
      "  |  _____  | ",
      "  | /     \\ | ",
      "   ¯¯¯¯¯¯¯¯¯  ",
    ],
  },
  {
    name: "Full bloom",
    art: [
      "  ,´( () )`,  ",
      " ( (( @@ )) ) ",
      " ( (( @@ )) ) ",
      "  `( (  ) )´  ",
      "   `´-||-´`   ",
      "      |       ",
      " \\\\   |   //  ",
      "  \\\\  |  //   ",
      "      |       ",
      "      |       ",
      "  ~~~~~~~~~~~  ",
      "  | |¯¯¯| | | ",
      "  |  _____  | ",
      "  | /     \\ | ",
      "   ¯¯¯¯¯¯¯¯¯  ",
    ],
  },
];

const POT_START = 10;

function getLineColor(lineIdx, stageIdx) {
  if (lineIdx === POT_START) return "#6b4f3a";
  if (lineIdx > POT_START) return "#8b6347";
  if (stageIdx >= 4) return "#b03070";
  return "#3a8c3f";
}

export default function RoseFlower({
  autoPlay = false,
  autoPlayInterval = 900,
  showControls = true,
  className = "",
  initialStage = 0,
}) {
  const [stage, setStage] = useState(initialStage);
  const [playing, setPlaying] = useState(autoPlay);
  const [key, setKey] = useState(0);

  const next = useCallback(() => {
    setStage((s) => Math.min(s + 1, STAGES.length - 1));
  }, []);

  const reset = useCallback(() => {
    setPlaying(false);
    setStage(0);
    setKey((k) => k + 1);
  }, []);

  const togglePlay = useCallback(() => {
    if (stage >= STAGES.length - 1) {
      setStage(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  }, [stage]);

  useEffect(() => {
    if (!playing) return;
    if (stage >= STAGES.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(next, autoPlayInterval);
    return () => clearTimeout(t);
  }, [playing, stage, next, autoPlayInterval]);

  const current = STAGES[stage];
  const isBloom = stage === STAGES.length - 1;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        fontFamily: "'Georgia', serif",
        userSelect: "none",
      }}
    >
      <pre
        key={key}
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "clamp(10px, 2vw, 14px)",
          lineHeight: "1.45",
          margin: 0,
          padding: 0,
          background: "transparent",
        }}
      >
        {current.art.map((line, i) => (
          <span
            key={i}
            style={{
              display: "block",
              color: getLineColor(i, stage),
              transition: "color 0.35s ease",
            }}
          >
            {line}
          </span>
        ))}
      </pre>

{showControls && (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={togglePlay}
            style={{
              padding: "8px 20px",
              border: "1px solid #c0334d",
              borderRadius: "8px",
              background: playing ? "#c0334d" : "transparent",
              color: playing ? "#fff" : "#c0334d",
              fontSize: "13px",
              fontFamily: "'Georgia', serif",
              cursor: "pointer",
              transition: "all 0.2s ease",
              letterSpacing: "0.05em",
            }}
          >
            {playing ? "Pause" : stage >= STAGES.length - 1 ? "Replay" : "Grow"}
          </button>
          <button
            onClick={next}
            disabled={stage >= STAGES.length - 1}
            style={{
              padding: "8px 20px",
              border: "1px solid #ddc8bc",
              borderRadius: "8px",
              background: "transparent",
              color: stage >= STAGES.length - 1 ? "#ccc" : "#8b6347",
              fontSize: "13px",
              fontFamily: "'Georgia', serif",
              cursor: stage >= STAGES.length - 1 ? "default" : "pointer",
              letterSpacing: "0.05em",
            }}
          >
            Next
          </button>
          <button
            onClick={reset}
            style={{
              padding: "8px 20px",
              border: "1px solid #ddc8bc",
              borderRadius: "8px",
              background: "transparent",
              color: "#8b6347",
              fontSize: "13px",
              fontFamily: "'Georgia', serif",
              cursor: "pointer",
              letterSpacing: "0.05em",
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
