import React, { useState, useEffect } from "react";
import { BiTimer } from "react-icons/bi";
import "../styles/Timer.css";

interface Time {
  hours: number;
  minutes: number;
  seconds: number;
  decimals: number;
}

interface TimerPreset {
  name: string;
  duration: number; // in seconds
}

const TIME_PRESETS: TimerPreset[] = [
  { name: "5 minutos", duration: 5 * 60 },
  { name: "15 minutos", duration: 15 * 60 },
  { name: "25 minutos", duration: 25 * 60 },
  { name: "50 minutos", duration: 50 * 60 },
];

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
  const [remainingTime, setRemainingTime] = useState(0);
  const [countdownMode, setCountdownMode] = useState(false);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(0);
  const [customSeconds, setCustomSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> = 0;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        if (countdownMode && remainingTime > 0) {
          setRemainingTime((prevTime) => {
            if (prevTime <= 0.01) {
              clearInterval(interval);
              setIsActive(false);
              setIsPaused(false);
              return 0;
            }
            return prevTime - 0.01;
          });

          // Update time display for countdown
          const totalSeconds = Math.floor(remainingTime);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = Math.floor(totalSeconds % 60);
          const decimals = Math.floor((remainingTime % 1) * 100);

          setTime({
            hours,
            minutes,
            seconds,
            decimals,
          });
        } else if (!countdownMode) {
          // Regular timer functionality
          setTime((prevTime) => {
            let newDecimals = prevTime.decimals + 1;
            let newSeconds = prevTime.seconds;
            let newMinutes = prevTime.minutes;
            let newHours = prevTime.hours;

            if (newDecimals >= 100) {
              newDecimals = 0;
              newSeconds++;
            }

            if (newSeconds >= 60) {
              newSeconds = 0;
              newMinutes++;
            }

            if (newMinutes >= 60) {
              newMinutes = 0;
              newHours++;
            }

            return {
              hours: newHours,
              minutes: newMinutes,
              seconds: newSeconds,
              decimals: newDecimals,
            };
          });
        }
      }, 10);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, remainingTime, countdownMode]);

  const handleStart = () => {
    if (countdownMode && remainingTime === 0) {
      // Set custom time
      const totalSeconds =
        customHours * 3600 + customMinutes * 60 + customSeconds;

      if (totalSeconds > 0) {
        setRemainingTime(totalSeconds);
        setTime({
          hours: customHours,
          minutes: customMinutes,
          seconds: customSeconds,
          decimals: 0,
        });
      } else {
        return; // Don't start if no time is set
      }
    }

    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setTime({ hours: 0, minutes: 0, seconds: 0, decimals: 0 });
    setIsActive(false);
    setIsPaused(false);
    setRemainingTime(0);
  };

  const handleLap = () => {
    if (isActive && !isPaused) {
      setLaps([...laps, formatTime(time)]);
    }
  };

  const handleClearLaps = () => {
    setLaps([]);
  };

  const handleSelectPreset = (preset: TimerPreset) => {
    handleReset();
    setCountdownMode(true);
    setRemainingTime(preset.duration);

    const hours = Math.floor(preset.duration / 3600);
    const minutes = Math.floor((preset.duration % 3600) / 60);
    const seconds = preset.duration % 60;

    setTime({
      hours,
      minutes,
      seconds,
      decimals: 0,
    });

    setCustomHours(hours);
    setCustomMinutes(minutes);
    setCustomSeconds(seconds);
  };

  const handleToggleMode = () => {
    handleReset();
    setCountdownMode(!countdownMode);
  };

  const formatTime = (time: Time) => {
    return `${time.hours.toString().padStart(2, "0")}:${time.minutes
      .toString()
      .padStart(2, "0")}:${time.seconds
      .toString()
      .padStart(2, "0")}.${time.decimals.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="timer-mode-selection">
        <button
          onClick={handleToggleMode}
          className={countdownMode ? "selected-mode" : ""}
        >
          {countdownMode ? "Modo Contagem Regressiva" : "Modo Cronômetro"}
        </button>
      </div>

      <div className="timer-container">
        <div className="timer">
          <div className="inner-container">
            <BiTimer />
            <h1>React Timer</h1>
            <div className="timer-display">{formatTime(time)}</div>
            <div className="buttons">
              {!isActive && !isPaused ? (
                <button
                  onClick={handleStart}
                  disabled={
                    countdownMode &&
                    remainingTime === 0 &&
                    !customHours &&
                    !customMinutes &&
                    !customSeconds
                  }
                >
                  Start
                </button>
              ) : isPaused ? (
                <button onClick={handleResume}>Resume</button>
              ) : (
                <button onClick={handlePause}>Pause</button>
              )}
              <button onClick={handleReset}>Reset</button>
              {isActive && !isPaused && !countdownMode && (
                <button onClick={handleLap}>Lap</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {countdownMode && (
        <div className="countdown-options">
          <div className="presets">
            <h3>Contagem Regressiva</h3>
            <div className="preset-buttons">
              {TIME_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="custom-time">
            <h3>Tempo Personalizado</h3>
            <div className="time-inputs">
              <div className="time-input-group">
                <label>Horas</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={customHours}
                  onChange={(e) =>
                    setCustomHours(parseInt(e.target.value) || 0)
                  }
                  disabled={isActive}
                />
              </div>
              <div className="time-input-group">
                <label>Minutos</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={customMinutes}
                  onChange={(e) =>
                    setCustomMinutes(parseInt(e.target.value) || 0)
                  }
                  disabled={isActive}
                />
              </div>
              <div className="time-input-group">
                <label>Segundos</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={customSeconds}
                  onChange={(e) =>
                    setCustomSeconds(parseInt(e.target.value) || 0)
                  }
                  disabled={isActive}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {laps.length > 0 && !countdownMode && (
        <div className="laps-container">
          <h3>Voltas</h3>
          <ul className="laps-list">
            {laps.map((lap, index) => (
              <li key={index}>
                Volta {index + 1}: {lap}
              </li>
            ))}
          </ul>
          <button onClick={handleClearLaps}>Limpar Voltas</button>
        </div>
      )}
    </>
  );
}
