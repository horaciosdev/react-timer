import React, { useState, useEffect } from "react";
import { BiTimer } from "react-icons/bi";
import "../styles/Timer.css";

interface Time {
  hours: number;
  minutes: number;
  seconds: number;
  decimals: number;
}

export default function Timer() {
  const [time, setTime] = useState<Time>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    decimals: 0,
  });
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [laps, setLaps] = useState<string[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> = 0;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const decimals = prevTime.decimals + 1;
          const seconds = prevTime.seconds + Math.floor(decimals / 100);
          const minutes = prevTime.minutes + Math.floor(seconds / 60);
          const hours = prevTime.hours + Math.floor(minutes / 60);

          return {
            hours: hours,
            minutes: minutes % 60,
            seconds: seconds % 60,
            decimals: decimals % 100,
          };
        });
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsActive(true);
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setTime({ hours: 0, minutes: 0, seconds: 0, decimals: 0 });
    setIsActive(false);
    setIsPaused(false);
  };

  const handleLap = () => {
    if (isActive && !isPaused) {
      setLaps([...laps, formatTime(time)]);
    }
  };

  const handleClearLaps = () => {
    setLaps([]);
  };

  const formatTime = (time: Time) => {
    return `${time.hours.toString().padStart(2, "0")}:${time.minutes
      .toString()
      .padStart(2, "0")}:${time.seconds
      .toString()
      .padStart(2, "0")}:${time.decimals.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="timer-container">
        <div className="timer">
          <div className="inner-container">
            <BiTimer />
            <h1>React Timer</h1>
            <div className="timer-display">{formatTime(time)}</div>
            <div className="buttons">
              {!isActive && !isPaused ? (
                <button onClick={handleStart}>Start</button>
              ) : isPaused ? (
                <button onClick={handleResume}>Resume</button>
              ) : (
                <button onClick={handlePause}>Pause</button>
              )}
              <button onClick={handleReset}>Reset</button>
              {isActive && !isPaused && (
                <button onClick={handleLap}>Lap</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        {laps.length > 0 && (
          <div className="laps-container">
            <h3>Laps</h3>
            <ul className="laps-list">
              {laps.map((lap, index) => (
                <li key={index}>
                  Lap {index + 1}: {lap}
                </li>
              ))}
            </ul>
            <button onClick={handleClearLaps}>Clear Laps</button>
          </div>
        )}
      </div>
    </>
  );
}
