import './App.css';
import { useState, useEffect } from 'react';
import { calculateTypingSpeed, getHighlightedText, getRandomSentence } from './utils';

const GameState = {
    NotStarted: 'NOT_STARTED',
    Typing: 'TYPING',
    Finished: 'FINISHED',
};

const sentences = [
    "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    "The way to get started is to quit talking and begin doing.",
    "You must be the change you wish to see in the world.",
    "It is during our darkest moments that we must focus to see the light. ",
    "Only a life lived for others is a life worthwhile.",
    "You only live once, but if you do it right, once is enough.",
    "Life is like riding a bicycle. To keep your balance, you must keep moving.",
    "A person who never made a mistake never tried anything new.",
    "If you can't explain it simply, you don't understand it well enough.",
    "The only source of knowledge is experience.",
    "Talent without working hard is nothing.",
    "Life is too short for long-term grudges.",
    "Even if you are a minority of one, the truth is the truth.",
    "Believe you can and you're halfway there.",
    "It is hard to fail, but it is worse never to have tried to succeed.",
    "It is between one day, or day one.",
    "No amount of experimentation can ever prove me right; a single experiment can prove me wrong."
]

const NuggetImage = ({ className, height }) => {
    return (
        <img src="./nugget_types.svg" alt="cute typing beaver" className={className} style={{ height: height }} />
    )
}


const Header = ({ time }) => {
    return (
        <div className="header">
            <div className="image-row">
                <NuggetImage className="nugget-image" height="100px" />
                <NuggetImage className="nugget-image main-nugget" height="250px" />
                <NuggetImage className="nugget-image right-nugget" height="100px" />
            </div>
            <h1>NuggetType</h1>
            <p className="time-label">Time: {time.toFixed(2)} seconds</p>
        </div>
    )
}

const TypingInput = ({ gameState, input, sentence, handleInputChange }) => {
    const { correctText, incorrectText, remainingText } = getHighlightedText(sentence, input);

    return (
        <div className="typing-input-container">
            <input
                type="text"
                value={input}
                onChange={handleInputChange}
                className="input-field"
                disabled={gameState === GameState.Finished}
                autoFocus
            />
            <div className="typed-text">
                <span className="correct-text">{correctText}</span>
                <span className="incorrect-text">{incorrectText}</span>
                <span className="remaining-text">{remainingText}</span>
            </div>
        </div>
    )
}

const Results = ({ time, sentence }) => {
    const speed = calculateTypingSpeed(sentence, time);

    return (
        <div className="results">
            <p>Finished! Your time: {time.toFixed(2)} seconds</p>
            <p>Speed: {speed.toFixed(2)} wpm</p>
        </div>
    )
}

const ResetButton = ({ gameState, onClick }) => {
    return (
        <button onClick={onClick} className="reset-button">
            {gameState === GameState.Finished ? 'Play Again' : 'Reset'}
        </button>
    )
}

const App = () => {
    const [gameState, setGameState] = useState(GameState.NotStarted);
    const [sentence, setSentence] = useState("");
    const [input, setInput] = useState("");
    const [time, setTime] = useState(0);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        let interval;
        if (gameState === GameState.Typing) {
            if (!startTime) {
                setStartTime(Date.now());
            }

            interval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                setTime(elapsedTime / 1000);
            }, 100)

        } else if (gameState === GameState.Finished) {
            clearInterval(interval);
        } else if (gameState === GameState.NotStarted) {
            setSentence(getRandomSentence(sentences));
            setInput('');
            setTime(0);
            setStartTime(null);
        }
        return () => clearInterval(interval);
    }, [gameState, startTime])

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);
        if (gameState === GameState.NotStarted) {
            setGameState(GameState.Typing);
        }
        if (value === sentence) {
            setGameState(GameState.Finished);
        }
    }

    const resetGame = () => {
        setGameState(GameState.NotStarted);
    }

    return (
        <div className="app">
            <Header time={time} />
            <TypingInput
                gameState={gameState}
                input={input}
                handleInputChange={handleInputChange}
                sentence={sentence}
            />
            {gameState === GameState.Finished && <Results time={time} sentence={sentence} />}
            <ResetButton onClick={resetGame} gameState={gameState} />
        </div>
    )
}

export default App;