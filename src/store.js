// src/store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';

// Action types
const CHOOSE_PLAYER = 'CHOOSE_PLAYER';
const PLAY = 'PLAY';
let playing = '';

// Action creators
const choosingAction = (value) => {
    playing = value;
    return {
        type: CHOOSE_PLAYER,
        player: {
            player1: value,
            player2: value === 'x' ? 'o' : 'x',
        },
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
            return action.player;
        default:
            return state;
    }
};

// Reducer for game board
const initialGameState = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];

const playingReducer = (state = initialGameState, action) => {
    switch (action.type) {
        case PLAY:
            const { row, col } = action.payload;
            if (state[row][col] === '') {
                // Create a new copy of the state to ensure immutability
                const newState = state.map((arr) => arr.slice());
                newState[row][col] = playing; // Update with the current player's symbol
                playing = playing === 'x' ? 'o' : 'x';

                let doesInlcudeSpace = false;
                for (const arr of newState) {
                    if (arr.includes('')) {
                        doesInlcudeSpace = true;
                        break;
                    }
                }
                if (!doesInlcudeSpace) {
                    alert('it is over');
                }

                return newState;
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