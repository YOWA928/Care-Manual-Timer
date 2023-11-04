import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import "./Timer.css";

import timerSound from '../sounds/Countdown03-4.mp3';

const red = '#e150d7';
const green = '#4aec8c';

const Timer = ({ selectedTasksData }) => {
  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState('work'); // work/break/null
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const breakMinutes = 1;
  let workingMinutes = 10;

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);
  const navigate = useNavigate();

  const tick = () => {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  };

  const playSound = () => {
    const audio = new Audio(timerSound);
    audio.play();

    if (secondsLeftRef.current === 0) {
      audio.pause();
    }
  };

  useEffect(() => {
    const switchMode = () => {
      if (modeRef.current === "work") {
        if (currentIndex === selectedTasksData.length - 1) {
          toast.dismiss();
          toast.success("全てのタスクが完了しました！");
          navigate('/completed');
        } else {
          setMode("break");
          modeRef.current = 'break';
          setSecondsLeft(breakMinutes * 60);
          secondsLeftRef.current = breakMinutes * 60;
        }
      } else {
        if (currentIndex < selectedTasksData.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setMode("work");
          modeRef.current = 'work';
          workingMinutes = selectedTasksData[currentIndex + 1].minutes;
          setSecondsLeft(workingMinutes * 60);
          secondsLeftRef.current = workingMinutes * 60;
        } else if (currentIndex === selectedTasksData.length - 1) {
          navigate('/completed');
        }
      }
    };

    if (selectedTasksData.length > 0) {
      workingMinutes = selectedTasksData[currentIndex].minutes;
      secondsLeftRef.current = workingMinutes * 60;
      setSecondsLeft(secondsLeftRef.current);
    } else {
      workingMinutes = 10;
      secondsLeftRef.current = workingMinutes * 60;
      setSecondsLeft(secondsLeftRef.current);
    }

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 11) {
        playSound();
      }
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }
      tick();
    }, 100);

    return () => clearInterval(interval);
  }, [selectedTasksData, currentIndex]);

  const totalSeconds = mode === 'work'
    ? workingMinutes * 60
    : breakMinutes * 60;

  const percentage = Math.round(secondsLeft / totalSeconds * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = '0' + seconds;

  return (
    <div>
      <h2 className="timerpage-title">タスクを開始する</h2>
      <div className="timer-page-container">
        <section className='task-display'>
          <div className="selected-tasks">

            { selectedTasksData.length > 0 ? (
              modeRef.current === "break" && selectedTasksData[currentIndex + 1]?.person !== undefined ? (
                <div className="timer-title">
                  <h2 className='person-title'>{ selectedTasksData[currentIndex + 1].person + 'さん' }</h2> ★ 次のタスク ★
                </div>
              ) : (
                <div className="timer-title">
                  <h2 className='person-title'>{ selectedTasksData[currentIndex]?.person + 'さん' }</h2> ★ 現在のタスク ★
                </div>
              )) : (
              <div className="timer-title">
              </div>
            )
            }


            { selectedTasksData.length > 0 ? (
              <div className="selected-task">
                <div className="name-box">
                  <label>タスク名 :　 </label>
                  <span>  { modeRef.current === "break" ? <span>{ selectedTasksData[currentIndex + 1].name }</span> : <span>{ selectedTasksData[currentIndex].name }</span> }</span>
                </div>
                <div className="name-box">
                  <label>時間 :　 </label>
                  <span>  { modeRef.current === "break" ? <span>{ selectedTasksData[currentIndex + 1].minutes }</span> : <span>{ selectedTasksData[currentIndex].minutes }</span> } min</span>
                </div>
                <div className="name-box">
                  <label>マニュアル :　</label> <br />
                  <span className='manual-area'>
                    { modeRef.current === "break"
                      ? selectedTasksData[currentIndex + 1].memo.split('\n').map((line, index) => (
                        <div key={ index }>{ line }</div>
                      ))
                      : selectedTasksData[currentIndex].memo.split('\n').map((line, index) => (
                        <div key={ index }>{ line }</div>
                      ))
                    }
                  </span>
                </div>
              </div>
            ) : (
              <p className='no-task'>
                タスクなし<br />
                新しいタスクをセットしましょう！
              </p>
            ) }
          </div>
        </section >

        <section className='timer-display'>
          <CircularProgressbar
            className='timer-screen'
            value={ percentage }
            text={ minutes + ":" + seconds }
            styles={ buildStyles({
              textColor: "#fff",
              pathColor: mode === 'work' ? red : green,
              trailColor: 'rgba(255,255,255,.2)',
              pathTransitionDuration: 0.4,
            }) }
            strokeWidth={ 12 }
          />

          <div className='timer-btn'>
            { isPaused ? <button className="tb" onClick={ () => { setIsPaused(false); isPausedRef.current = false; } }><i className="bi bi-play-circle"></i></button>
              : <button className="tb" onClick={ () => { setIsPaused(true); isPausedRef.current = true; } }><i className="bi bi-pause-circle"></i></button>
            }
          </div>
        </section>
      </div >
    </div>
  );
};

export default Timer;
