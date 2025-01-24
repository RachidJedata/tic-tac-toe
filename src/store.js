// src/store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';

// Action types
const CHOOSE_PLAYER = 'CHOOSE_PLAYER';
const PLAY = 'PLAY';

// Action creators
const choosingAction = (value) => {
    return {
        type: CHOOSE_PLAYER,
        player: {
            player1: value,
            player2: value === 'x' ? 'o' : 'x',
        },
        currentPlayer: value, // Set the current player to the chosen value
    };
};

const playAction = (row, col) => {
    return {
        type: PLAY,
        payload: { row, col },
    };
};

// Reducer for player selection
const initialPlayersState = {
    player1: '',
    player2: '',
};

const choosingReducer = (state = initialPlayersState, action) => {
    switch (action.type) {
        case CHOOSE_PLAYER:
            return {
                ...state,
                player1: action.player.player1,
                player2: action.player.player2,
            };
        default:
            return state;
    }
};

// Reducer for game board
const initialGameState = {
    board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ],
    isGameOver: false, // Track if the game is over
    currentPlayer: '', // Track the current player (initially empty)
    winningCells: []
};
const isThereWinner = (board) => {
    // Check rows for a winner
    for (let i = 0; i < 3; i++) {
        if (board[i][0] !== '' && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
            return { hasWinner: true, winningCells: [[i, 0], [i, 1], [i, 2]] }; // Row winner
        }
    }

    // Check columns for a winner
    for (let i = 0; i < 3; i++) {
        if (board[0][i] !== '' && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
            return { hasWinner: true, winningCells: [[0, i], [1, i], [2, i]] }; // Column winner
        }
    }

    // Check diagonals for a winner
    if (board[1][1] !== '') {
        // Main diagonal (top-left to bottom-right)
        if (board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
            return { hasWinner: true, winningCells: [[0, 0], [1, 1], [2, 2]] }; // Diagonal winner
        }
        // Anti-diagonal (top-right to bottom-left)
        if (board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
            return { hasWinner: true, winningCells: [[0, 2], [1, 1], [2, 0]] }; // Diagonal winner
        }
    }

    // Check if the board is full (no empty spaces left)
    return { hasWinner: false, winningCells: [] };
};


const playingReducer = (state = initialGameState, action) => {
    switch (action.type) {
        case CHOOSE_PLAYER:
            // Update the current player when a player is chosen
            return {
                ...state,
                currentPlayer: action.currentPlayer,
            };
        case PLAY:
            if (state.isGameOver) return state;
            
            const { row, col } = action.payload;
            if (state.board[row][col] === '') {
                // Create a new copy of the state to ensure immutability
                const newBoard = state.board.map((arr) => arr.slice());
                newBoard[row][col] = state.currentPlayer; // Update with the current player's symbol

                // Check if the game is over (no empty spaces left)
                const { hasWinner, winningCells } = isThereWinner(newBoard);
                const isGameOver = hasWinner || !newBoard.some((row) => row.includes(''));

                return {
                    ...state,
                    board: newBoard,
                    currentPlayer: state.currentPlayer === 'x' ? 'o' : 'x', // Switch players
                    isGameOver, // Update game over state,
                    winningCells
                };
            }
            return state; // Return the same state if the cell is already occupied
        default:
            return state;
    }
};

// Combine reducers
const rootReducer = combineReducers({
    players: choosingReducer,
    game: playingReducer,
});

// Create the store using configureStore
const store = configureStore({
    reducer: rootReducer,
    // Optional: Add middleware, devTools, etc. here
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    // devTools: process.env.NODE_ENV !== 'production',
});

export { choosingAction, playAction }; // Export the action creators
export default store;