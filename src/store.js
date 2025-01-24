// store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';

// Action types
const CHOOSE_PLAYER = 'CHOOSE_PLAYER';
const PLAY = 'PLAY';
const PC_PLAYING = 'PC_PLAYING';
const PC_MOVE = 'PC_MOVE';

// Action creators
const choosingAction = (value) => ({
  type: CHOOSE_PLAYER,
  payload: {
    player1: value,
    player2: value === 'x' ? 'o' : 'x',
    currentPlayer: value,
  }
});

const playAction = (row, col) => ({ type: PLAY, payload: { row, col } });
const gameMode = (pcPlaying) => ({ type: PC_PLAYING, payload: pcPlaying });
const pcMoveAction = () => ({ type: PC_MOVE });

// Reducers
const initialPlayersState = { player1: '', player2: '' };
const choosingReducer = (state = initialPlayersState, action) => {
  switch (action.type) {
    case CHOOSE_PLAYER:
      return { 
        ...state, 
        player1: action.payload.player1,
        player2: action.payload.player2
      };
    default:
      return state;
  }
};

const initialGameState = {
  board: Array(3).fill().map(() => Array(3).fill('')),
  isGameOver: false,
  currentPlayer: '',
  pcPlaying: false,
  winningCells: [],
  playerSymbols: { human: '', pc: '' } // Add player symbols directly in game state
};

const calculatePCMove = (board) => {
  const emptyCells = [];
  board.forEach((row, i) => row.forEach((cell, j) => {
    if (cell === '') emptyCells.push([i, j]);
  }));
  return emptyCells.length ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
};

const checkWinner = (board) => {
  // Check rows and columns
  for (let i = 0; i < 3; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) 
      return [[i,0], [i,1], [i,2]];
    if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) 
      return [[0,i], [1,i], [2,i]];
  }
  // Check diagonals
  if (board[1][1]) {
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) 
      return [[0,0], [1,1], [2,2]];
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) 
      return [[0,2], [1,1], [2,0]];
  }
  return null;
};

const playingReducer = (state = initialGameState, action) => {
  switch (action.type) {
    case CHOOSE_PLAYER:
      return {
        ...state,
        currentPlayer: action.payload.currentPlayer,
        playerSymbols: {
          human: action.payload.player1,
          pc: action.payload.player2
        }
      };

    case PC_PLAYING:
      return { ...state, pcPlaying: action.payload };

    case PLAY: {
      if (state.isGameOver || state.board[action.payload.row][action.payload.col]) return state;
      
      const newBoard = state.board.map(row => [...row]);
      newBoard[action.payload.row][action.payload.col] = state.currentPlayer;
      
      const winningCells = checkWinner(newBoard);
      const isGameOver = !!winningCells || newBoard.flat().every(cell => cell !== '');
      
      return {
        ...state,
        board: newBoard,
        currentPlayer: state.currentPlayer === 'x' ? 'o' : 'x',
        isGameOver,
        winningCells: winningCells || []
      };
    }

    case PC_MOVE: {
      if (state.isGameOver || !state.pcPlaying || state.currentPlayer !== state.playerSymbols.pc) 
        return state;
      
      const move = calculatePCMove(state.board);
      if (!move) return state;
      
      const newBoard = state.board.map(row => [...row]);
      newBoard[move[0]][move[1]] = state.currentPlayer;
      
      const winningCells = checkWinner(newBoard);
      const isGameOver = !!winningCells || newBoard.flat().every(cell => cell !== '');
      
      return {
        ...state,
        board: newBoard,
        currentPlayer: state.currentPlayer === 'x' ? 'o' : 'x',
        isGameOver,
        winningCells: winningCells || []
      };
    }

    default:
      return state;
  }
};

const rootReducer = combineReducers({
  players: choosingReducer,
  game: playingReducer
});

const store = configureStore({ reducer: rootReducer });

export { choosingAction, playAction, gameMode, pcMoveAction };
export default store;