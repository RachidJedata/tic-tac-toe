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
    playerSymbols: { human: '', pc: '' }
};

// Utility functions
const checkWinner = (board) => {
    const lines = [
        // Rows
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Columns
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Diagonals
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    for (const line of lines) {
        const [a, b, c] = line;
        if (
            board[a[0]][a[1]] &&
            board[a[0]][a[1]] === board[b[0]][b[1]] &&
            board[a[0]][a[1]] === board[c[0]][c[1]]
        ) {
            return {
                winner: board[a[0]][a[1]],
                cells: line
            };
        }
    }
    return { winner: null, cells: null };
};

const evaluateBoard = (board, playerSymbols) => {
    const result = checkWinner(board);
    if (result.winner === playerSymbols.pc) return 10;
    if (result.winner === playerSymbols.human) return -10;
    return 0;
};

const calculatePCMove = (board, playerSymbols) => {
    const isBoardFull = (board) => board.every(row => row.every(cell => cell !== ''));

    const minimax = (board, depth, isMaximizing) => {
        const score = evaluateBoard(board, playerSymbols);

        if (score === 10 || score === -10) return score;
        if (isBoardFull(board)) return 0;

        let bestValue = isMaximizing ? -Infinity : Infinity;

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === '') {
                    board[i][j] = isMaximizing ? playerSymbols.pc : playerSymbols.human;
                    const value = minimax(board, depth + 1, !isMaximizing);
                    board[i][j] = '';
                    bestValue = isMaximizing
                        ? Math.max(bestValue, value)
                        : Math.min(bestValue, value);
                }
            }
        }
        return bestValue;
    };

    let bestValue = -Infinity;
    let bestMove = null;

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === '') {
                board[i][j] = playerSymbols.pc;
                const moveValue = minimax(board, 0, false);
                board[i][j] = '';
                if (moveValue > bestValue) {
                    bestValue = moveValue;
                    bestMove = [i, j];
                }
            }
        }
    }

    return bestMove;
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

            const result = checkWinner(newBoard);
            const isGameOver = !!result.winner || newBoard.flat().every(cell => cell !== '');

            return {
                ...state,
                board: newBoard,
                currentPlayer: state.currentPlayer === 'x' ? 'o' : 'x',
                isGameOver,
                winningCells: result.cells || []
            };
        }

        case PC_MOVE: {
            if (state.isGameOver || !state.pcPlaying || state.currentPlayer !== state.playerSymbols.pc)
                return state;

            const move = calculatePCMove(state.board, state.playerSymbols);
            if (!move) return state;

            const newBoard = state.board.map(row => [...row]);
            newBoard[move[0]][move[1]] = state.currentPlayer;

            const result = checkWinner(newBoard);
            const isGameOver = !!result.winner || newBoard.flat().every(cell => cell !== '');

            return {
                ...state,
                board: newBoard,
                currentPlayer: state.currentPlayer === 'x' ? 'o' : 'x',
                isGameOver,
                winningCells: result.cells || []
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
