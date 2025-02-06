import { useState, useCallback, useEffect } from "react";
import logo from "/colors.svg";
import "./App.css";

// Generate a random color in hex format
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  // Each hex color code should start with '#'
  let color = "#";
  for (let i = 0; i < 6; i++) {
    // Randomly pick on letter in letters
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Generate array of colors including the one to be guessed
const generateColorOptions = (targetColor) => {
  const colors = [targetColor];
  while (colors.length < 6) {
    const newColor = generateRandomColor();
    if (!colors.includes(newColor)) {
      colors.push(newColor);
    }
  }
  return colors.sort(() => Math.random() - 0.5);
};

const App = () => {
  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  const newGuess = useCallback(() => {
    const newColor = generateRandomColor();
    setTargetColor(newColor);
    setOptions(generateColorOptions(newColor));
    setGameStatus("");
    setIsCorrect(null);
  }, []);

  const startNewGame = useCallback(() => {
    setScore(0);
    newGuess();
  }, [newGuess]);

  useEffect(() => {
    newGuess();
  }, [newGuess]);

  const handleGuess = (color) => {
    if (color === targetColor) {
      setScore((prev) => prev + 1);
      setGameStatus("Correct! Well done!");
      setIsCorrect(true);
    } else {
      setGameStatus("Wrong! Try again!");
      // Prevent score from going below 0
      setScore((prev) => Math.max(0, prev - 1));
      setIsCorrect(false);
    }
    // Add a small delay before starting new game to show the result
    setTimeout(() => {
      newGuess();
    }, 1000);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="game-card">
          <img className="logo" src={logo} alt="logo" />
          <h1 className="game-title">Color Game</h1>

          <p data-testid="gameInstructions" className="instructions">
            Can you guess which color matches the box below?
            <br />
            Click on one of the options!
          </p>

          <div className="score-container">
            <div data-testid="score" className="score-text">
              Score: <span className="score-value">{score}</span>
            </div>

            <button
              data-testid="newGameButton"
              onClick={startNewGame}
              className="new-game-btn"
            >
              <i size={20} className="fa-solid fa-arrows-rotate"></i>
              New Game
            </button>
          </div>

          <div
            data-testid="colorBox"
            className="color-box"
            style={{ backgroundColor: targetColor }}
          />

          {gameStatus && (
            <div
              data-testid="gameStatus"
              className={`status-message ${isCorrect ? "correct" : "wrong"}`}
            >
              {gameStatus}
            </div>
          )}

          <div className="color-options-grid">
            {options.map((color, index) => (
              <button
                key={index}
                data-testid="colorOption"
                onClick={() => handleGuess(color)}
                className="color-option"
                style={{ backgroundColor: color }}
                aria-label={`Color option ${color}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
