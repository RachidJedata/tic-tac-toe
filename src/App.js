import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { choosingAction, playAction, gameMode, pcMoveAction } from './store'; // Import all action creators
import './App.css';

const Game = () => {
  const players = useSelector((state) => state.players); // Access the players state
  const game = useSelector((state) => state.game); // Access the game state
  const dispatch = useDispatch();
  const [showGameOver, setShowGameOver] = useState(false); // State to control game over UI delay
  const [showGameMode, setShowGameMode] = useState(true); // State to control game mode selection UI

  const setGameMode = (val) => {
    const pcPlaying = val === 'pc'; // Set pcPlaying based on the selected mode
    dispatch(gameMode(pcPlaying)); // Dispatch the game mode action
    setShowGameMode(false); // Hide the game mode selection UI
  };

  const choosingPlayer = (val) => {
    dispatch(choosingAction(val)); // Dispatch the choosing action
  };

  const handleCellClick = (row, col) => {
    if (!game.isGameOver && !game.board[row][col]) {
      dispatch(playAction(row, col)); // Dispatch the play action
      if (game.pcPlaying) {
        setTimeout(()=>{
          dispatch(pcMoveAction());
        },200);
      }
    }
  };

  const isWinningCell = (row, col) => {
    return game.winningCells?.some((cell) => cell[0] === row && cell[1] === col);
  };

  useEffect(() => {
    if (game.isGameOver) {
      // Delay showing the game over UI by 2500ms
      const timer = setTimeout(() => {
        setShowGameOver(true);
      }, 2500);
      return () => clearTimeout(timer); // Cleanup timer
    } else {
      setShowGameOver(false); // Reset game over UI state
    }
  }, [game.isGameOver]);

  const gameModeUI = () => {
    return (
      <div className="container">
        <div className="wrapper">
          <h1 className="title">Choose Game Mode</h1>
          <div className="mode-selection">
            <button
              className="mode-button"
              onClick={() => setGameMode('pc')}
            >
              Play vs Computer
            </button>
            <button
              className="mode-button"
              onClick={() => setGameMode('twoPlayers')}
            >
              Play vs Friend
            </button>
          </div>
        </div>
      </div>
    );
  };

  const playingUI = () => {
    return (
      <div className="game">
        <h1>Tic Tac Toe</h1>
        <div className="board">
          {game.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${cell || ''} ${isWinningCell(rowIndex, colIndex) ? 'winning-cell' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const gameOverUI = () => {
    const isDraw = game.winningCells.length === 0; // Check if the game is a draw
    const winner = isDraw
      ? null
      : players.player1 === game.board[game.winningCells[0][0]][game.winningCells[0][1]]
        ? 'Player 1'
        : game.pcPlaying ? 'PC' : 'Player 2';

    return (
      <div className="game-over">
        <h1>Game Over</h1>
        <h2>
          {isDraw
            ? "It's a Draw!"
            : `${winner} Won!`}
        </h2>
        <button onClick={() => window.location.reload()}>Play Again</button>
      </div>
    );
  };

  const choosingUI = () => {
    return (
      <div className="player-select">
        <h2>Choose Your Side</h2>
        <div className="selection-container">
          <div className="selection-box">
            <div className="cell x"></div>
            <button onClick={() => choosingPlayer('x')} className="select-btn">
              Choose X
            </button>
          </div>
          <div className="selection-box">
            <div className="cell o"></div>
            <button onClick={() => choosingPlayer('o')} className="select-btn">
              Choose O
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (showGameOver) {
    return gameOverUI(); // Show game over UI if the game is over
  }

  if (showGameMode) {
    return gameModeUI(); // Show game mode selection UI
  }

  return !players.player1 ? choosingUI() : playingUI(); // Show choosing or playing UI
};

export default Game;