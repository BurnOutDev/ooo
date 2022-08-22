import React, { useEffect, useState } from "react";
import EmojiPairs from "./data/EmojiPairs";
import "./style.css";

const COLUMNS = 15;

const ROWS = 8;

const TOTAL = COLUMNS * ROWS; // 15x8 grid
const COUNTER = Array(TOTAL);

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function App() {
  const [score, setScore] = useState(0);

  const [counterArray, setCounterArray] = useState<string[]>([]);

  const [randomIndexForOdd, setRandomIndexForOdd] = useState(
    getRandomInt(0, COUNTER.length)
  );
  const [randomIndexForEmoji, setRandomIndexForEmoji] = useState(
    getRandomInt(0, EmojiPairs.length)
  );

  const [status, setStatus] = useState<"won" | "lost" | "ongoing">("ongoing");

  const reset = () => {
    setRandomIndexForEmoji(getRandomInt(0, EmojiPairs.length));
    setRandomIndexForOdd(getRandomInt(0, TOTAL - 1));
    setStatus("ongoing");
  };

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    const items = Array(TOTAL)
      .fill(0)
      .map((_, index) => {
        if (index === randomIndexForOdd) {
          return EmojiPairs[randomIndexForEmoji].OddOne;
        } else {
          return EmojiPairs[randomIndexForEmoji].Mass;
        }
      });

    setCounterArray(items);
  }, [randomIndexForEmoji, randomIndexForOdd]);

  useEffect(() => {
    if (status === "won") {
      reset();
    }
  }, [status]);

  const handleClick = (isOdd: boolean) => {
    if (isOdd) {
      setStatus("won");
      setScore((prevScore) => prevScore + 1);
    } else {
      setStatus("lost");
    }

    setStatus(isOdd ? "won" : "lost");
  };

  if (status !== "ongoing") {
    return (
      <div className="message-content">
        <h2 className="message" onClick={() => reset()}>
          {status === "lost" && "GAME OVER"}
        </h2>
        <br />
        <h2 className="message small" onClick={() => reset()}>
          YOUR SCORE: {score}
        </h2>
      </div>
    );
  }

  return (
    <div className="content">
      <table>
        <tbody>
          {counterArray.map((_, i) => {
            const isFirstElement = i === 0;
            const isDividableByColumnsCount = (i + 1) % COLUMNS === 0;
            const isNotLastElement = i < counterArray.length - 1;

            const condition =
              isFirstElement || (isDividableByColumnsCount && isNotLastElement);

            if (condition) {
              return (
                <tr>
                  {counterArray.slice(i, i + COLUMNS).map((x) => (
                    <td
                      onClick={() =>
                        handleClick(
                          EmojiPairs[randomIndexForEmoji].OddOne === x
                        )
                      }
                      style={{ fontSize: "3.5vw" }}
                    >
                      {x}
                    </td>
                  ))}
                </tr>
              );
            }
          })}
        </tbody>
      </table>
      <div className="score-row">
        <span className="current-score-label">Current score: </span>
        <span className="current-score-value">{score}</span>
      </div>
    </div>
  );
}

export default App;
