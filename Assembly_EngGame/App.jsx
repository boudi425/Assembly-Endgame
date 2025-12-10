import React from "react"
import languages from "./languages.js";
import clsx from "clsx";
import { getFarewellText, getRandomWord } from "./farewell.js";
import Confetti from "react-confetti";
export default function App() {
    const [lettersArr, setLettersArr] = React.useState([]);
    const [randomWord, setRandomWord] = React.useState(() => getRandomWord());
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const wrongGuessesArray = lettersArr.filter(letter => !randomWord.includes(letter)).length;
    const isGameWon = randomWord.split("").every(letter => lettersArr.includes(letter))
    const isGameLost = wrongGuessesArray >= languages.length-1;
    const isGameOver = isGameWon || isGameLost;
    const lastGuessedLetter = lettersArr[lettersArr.length - 1];
    const isLastGuessIncorrect = lastGuessedLetter && !randomWord.includes(lastGuessedLetter);
    console.log(`this is :${wrongGuessesArray}`);
    

    const randomWordSpans = randomWord.split("").map((e, index) => {
        const className = clsx("Letter", 
            isGameLost && !lettersArr.includes(e) && "missed-letter"
        )
        return (
                <span className={className} key={index}>
                    {lettersArr.includes(e) ? e.toUpperCase() : ""}
                    {isGameLost && !lettersArr.includes(e) ? e.toUpperCase() : null}
                </span>
            )
        }
    )
    function addGuessedLetter(letter) {
        setLettersArr(prev => 
            prev.includes(letter) ? prev : [...prev, letter]);
    };
    const lanArr = languages.map((e, index) => 
        <span 
        key={e.name}
        style={{backgroundColor: e.backgroundColor, color: e.color}}
        className={index < wrongGuessesArray ? "lost" : ""}
        >{e.name}
        </span>
        )
    const classNameStatus = clsx("status", {
        Won: isGameWon,
        Lost: isGameLost,
        Farewell: !isGameOver && isLastGuessIncorrect
    });
    function renderGameStatus() {
        if (!isGameOver && isLastGuessIncorrect) {
            return (
                <p className="farewell-message">{getFarewellText(languages[wrongGuessesArray-1].name)}</p>
            )
        }
        if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well Done!</p>
                </>
            )
        } 
        if  (isGameLost) {
            return (
                <>
                    <h2>Game Over!</h2>
                    <p>You lose! Better Start Learning Assembly</p>
                </> 
            )
        }
    }
    function restartTheGame() {
        setLettersArr([]);
        setRandomWord(getRandomWord());
    }
    return (
        <main>
            {isGameWon && 
            <Confetti
                recycle={false}
                numberOfPieces={1000}
            />}
            <header>
                <h2>Assembly: Endgame</h2>
                <p>Guess the word in under 8 attempts to keep
                    programming world safe from Assembly
                </p>
            </header>
            <section aria-live="polite" role="status" className={classNameStatus}>
                {renderGameStatus()}
            </section>
            <section className="languagesList">
                {lanArr}
            </section>
            <section className="randomWord">
                {randomWordSpans}
            </section>
            <section 
                className="sr-only"
                aria-live="polite"
                role="status"
            >
                <p>
                    {
                    lettersArr.includes(lastGuessedLetter) ?
                        `Correct! the letter ${lastGuessedLetter} is in the word.`:
                        `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {languages.length-1} attempts left.
                </p>
                <p>
                    Current word: {randomWord.split("").map(letter =>
                        lettersArr.includes(letter) ? letter + "." : "blank."
                    ).join(" ")}
                </p>
            </section>
            <section className={`keyboard ${isGameOver ? "disabled" : ""}`}>
                {
                alphabet.split("").map(e =>{
                const isGuessed = lettersArr.includes(e);
                const isCorrect = isGuessed && randomWord.includes(e);
                const isWrong =  isGuessed && !randomWord.includes(e);     
                const className = clsx({
                    correct: isCorrect,
                    wrong: isWrong
                })
                return (
                <button
                disabled={isGameOver}
                className={className} 
                aria-label={`Letter ${e}`}
                aria-disabled={lettersArr.includes(e)}
                key={e} 
                onClick={() => addGuessedLetter(e)}>
                    {e.toUpperCase()}
                </button>)})
                }
            </section>
            {isGameOver ? 
            <button className="RestartButton" onClick={restartTheGame}>New Game</button> 
            : ""}
        </main>
    )

}
