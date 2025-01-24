import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { choosingAction, playAction } from './store'; // Import both action creators
import './App.css';

const Game = () => {
  const player = useSelector((state) => state.players); // Access the correct state slice
  const game = useSelector((state) => state.game); // Access the correct state slice
  const dispatch = useDispatch();

  const choosingPlayer = (val) => {
    dispatch(choosingAction(val)); // Correctly dispatch the action
  };

  const playing = (row, col) => {
    dispatch(playAction(row, col)); // Correctly dispatch the action
  };

  const playingUI = () => {
    return (
      <div className="game">
        <h1>Tic Tac Toe</h1>
        <div className="board">
          <div onClick={() => playing(0, 0)} className={`cell ${game[0][0]}`}>
          </div>
          <div onClick={() => playing(0, 1)} className={`cell ${game[0][1]}`}>
          </div>
          <div onClick={() => playing(0, 2)} className={`cell ${game[0][2]}`}>
          </div>
          <div onClick={() => playing(1, 0)} className={`cell ${game[1][0]}`}>
          </div>
          <div onClick={() => playing(1, 1)} className={`cell ${game[1][1]}`}>
          </div>
          <div onClick={() => playing(1, 2)} className={`cell ${game[1][2]}`}>
          </div>
          <div onClick={() => playing(2, 0)} className={`cell ${game[2][0]}`}>
          </div>
          <div onClick={() => playing(2, 1)} className={`cell ${game[2][1]}`}>
          </div>
          <div onClick={() => playing(2, 2)} className={`cell ${game[2][2]}`}>
          </div>
        </div>
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

  return <>{!player.player1 ? choosingUI() : playingUI()}</>; // Check for player1 in the state
};

export default Game;