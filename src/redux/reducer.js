const initialState = {
    searchedGame: "",
    gamesInCart: [],
    favGames: [],
    gamesTags: [],
    creditCard: [],
    creditCardErrors: [],
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_CART":
            return {
                ...state,
                gamesInCart: [...state.gamesInCart, action.payload]
            }

        case "REMOVE_CART":
            return {
                ...state,
                gamesInCart: [...state.gamesInCart].filter(game => game.id !== action.payload)
            }

        case "ADD_FAV":
            return {
                ...state,
                favGames: [...state.favGames, action.payload]
            }

        case "REMOVE_FAV":
            return {
                ...state,
                favGames: [...state.favGames].filter(game => game.id !== action.payload)
            }

        case "SEARCH_GAME":
            const searchedGameTitle = state.allGames
                .filter(game => game.title === action.payload.title)
                .map(game => game.title);

            return { ...state, searchedGame: searchedGameTitle };

        case "FILTER_GAMES_TAGS":
            return {
                ...state,
                gamesTags: [...state.gamesTags, action.payload]
            }

        case "CREDIT_CARD":
            return {
                ...state,
                creditCard: [...state.creditCard, action.payload]
            }

        case "CREDIT_CARD_ERRORS":
            return {
                ...state,
                creditCardErrors: [...state.creditCardErrors, action.payload]
            }

        default:
            return {
                ...state
            }
    }
}

export default rootReducer