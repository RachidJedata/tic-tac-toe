import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { choosingAction, playAction } from './store'; // Import both action creators
import './App.css';

const Game = () => {
  const players = useSelector((state) => state.players); // Access the players state
  const game = useSelector((state) => state.game); // Access the game state
  const dispatch = useDispatch();

  const choosingPlayer = (val) => {
    dispatch(choosingAction(val)); // Dispatch the choosing action
  };

  const handleCellClick = (row, col) => {
    dispatch(playAction(row, col)); // Dispatch the play action
  };

  const isWinningCell = (row, col) => {
    return game.winningCells.some((cell) => cell[0] === row && cell[1] === col);
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
                className={`cell ${cell} ${isWinningCell(rowIndex, colIndex) ? 'winning-cell' : ''}`}
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
    return (
      <div className="game-over">
        <h1>Game Over</h1>
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

  // if (game.isGameOver) {
  //   return gameOverUI(); // Show game over UI if the game is over
  // }

  return !players.player1 ? choosingUI() : playingUI(); // Show choosing or playing UI
};

export default Game;