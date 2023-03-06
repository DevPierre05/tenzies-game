import { useState, useEffect } from 'react'
import { nanoid } from "nanoid";
import Dice from './components/Dice'
import Confetti from 'react-confetti'
import clickSound from "./sound/click.mp3"
import cheerSound from "./sound/cheering-claps.wav"
import rollSound from "./sound/rolling-dice.mp3"

import './App.css'

function App() {
  const generateDiceNumber = function() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  const allNewDice = function () {
    return Array.from({ length: 10 }, (item) => {
      return generateDiceNumber()
    });
  };

  const [dice, setDice] = useState(allNewDice());
  const [pointerEvent, setPointerEvent] = useState(false);
  const [tenzies, setTenzies] = useState(false);
  const [heldDice, setHeldDice] = useState([])
  const [allHeldSame, setAllHeldSame] = useState(false)
  const [rollTimes, setRollTimes] = useState(0)
  const [timer, setTimer] = useState(0)
  const [gameRecords, setGameRecords] = useState(() => JSON.parse(localStorage.getItem("records")) || [])
  const [isActive, setIsActive] = useState(false)
  
  useEffect(() => {
    setHeldDice(
      dice.filter((die) => {
        return die.isHeld;
      })
    );    
  }, [dice]);

  useEffect(() => {
    let myTimer = null
    if (isActive) {
      myTimer = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(myTimer);
    }
    return () => {
      clearInterval(myTimer);
    }
  }, [isActive]);

  useEffect(() => {
    if(!tenzies) {
      setAllHeldSame(heldDice.every((die) => die.value === heldDice[0].value));
      const firstValue = dice[0]?.value;
      const allHeld = dice.every((die) => die.isHeld);
      const allValueSame = dice.every((die) => die.value === firstValue);
      if (allHeld && allValueSame) {
        setGameRecords(prevGameRecords => {
          return [...prevGameRecords, {
            roll: rollTimes,
            time: timer
          }]    
        })
        setTenzies(true);
        setIsActive(false)
        new Audio(cheerSound).play();
      }
    }
  },[dice, heldDice, isActive])

  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(gameRecords));
  },[gameRecords])

  

  //Function when dice is rolled
  const rollDice = function() {
    //Reset the game
    if(tenzies) {
      setTenzies(false)
      setDice(allNewDice())
      setRollTimes(0)
      setTimer(0)
    }
    if (!tenzies) {
      new Audio(rollSound).play();
      setPointerEvent(true)
      if(allHeldSame) {
        setTimeout(() => {
          setDice(prevDice => prevDice.map(die => { 
            return die.isHeld ? die : generateDiceNumber()
          }))
        }, 200);
      }
      setIsActive(true)
      setRollTimes(prevRollTimes => prevRollTimes + 1)
    }
  }

  //Function to hold dice
  const holdDice = function (id) {
    new Audio(clickSound).play();
    setDice(prevDice => prevDice.map(die => {
      return die.id === id ? {...die, isHeld: !die.isHeld} : die
    }))
  }

  const diceElement = dice.map(die => {
    return (
      <Dice
        key={die.id}
        holdDice={() => holdDice(die.id)}
        pointerEvent={pointerEvent}
        die={die}
      />
    );
  })

  const savedArray = JSON.parse(localStorage.getItem("records"));
  console.log(savedArray)

  const timerRefractor = function() {
    let mm = Math.trunc(timer / 60);
    let ss = timer % 60;

    if (timer < 60) {
      return `${timer}s`
    }else{
      return `${mm}m:${ss}s`
    }
  }

  const recordDisplay = function() {
    let min = gameRecords[0].time
    for (let i = 0; i < gameRecords.length; i++) {
      if (gameRecords[i].time < min) {
        min = gameRecords[i].time
      } 
    }
    return `${min}sec`;
  }

  return (
    <section className="min-h-screen">
      {tenzies && <Confetti />}
      <div className="max-w-2xl container mx-auto mt-24 p-4 md:p-8 bg-slate-900 border border-black">
        <div className="bg-slate-200 rounded-lg px-6 md:px-12">
          <div className="relative">
            <h1 className="text-[#2B283A] text-5xl text-center pt-8 pb-2 mb-8 font-bold leading-6 tracking-widest">
              Tenzies
            </h1>
            <div className="flex justify-between items-center">
              <div className="record-stats tracking-wide">
                <h2 className="uppercase text-green text-lg font-bold text-red-600 underline underline-offset-8">
                  Record Score
                </h2>
                {/* <p className="text-lg italic text-sky-900">
                  <strong>Rolls: </strong>
                  <span>5</span>
                </p> */}
                {gameRecords.length > 0 && (
                  <p className="text-xl italic text-sky-900">
                    <strong>Time: </strong>
                    <span>{recordDisplay()}</span>
                  </p>
                )}
              </div>

              <div className="side-bar tracking-wide">
                <h2>
                  <strong className="text-[#662a25] text-lg">Rolls 🎲: </strong>
                  {rollTimes}
                </h2>
                <h2>
                  <strong className="text-[#662a25] text-lg">Timer ⏲: </strong>
                  {timerRefractor()}
                </h2>
              </div>
            </div>
          </div>
          <p className="px-0 pt-8 tracking-wide md:text-center text-lg md:px-12 md:pt-8">
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </p>
          <div className="px-2 py-8 grid grid-cols-5 gap-x-16 justify-items-center md:px-8 md:py-8 md:gap-x-6">
            {diceElement}
          </div>
          <div className="flex flex-col items-center pb-12">
            {/* <button className='border-black bg-[#e63f3f] w-1/4 px-4 py-2 mb-4 rounded-md'>Finish</button> */}
            {allHeldSame ? (
              <button
                onClick={rollDice}
                className="roll-dice bg-[#5035FF] w-1/2  md:w-1/2 border rounded-md text-slate-200 tracking-wide px-6 py-2 transition delay-150"
              >
                {tenzies ? "New Game" : "Roll"}
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <footer className="text-center italic">
        Coded by{" "}
        <span>
          <a target="_blank" href="https://github.com/DevPierre05">
            Peter Osei
          </a>
        </span>
      </footer>
    </section>
  );
}

export default App
