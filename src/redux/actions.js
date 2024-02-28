export const addToCart = (id) => {
    return {
        type: "ADD_CART",
        payload: id
    }
}

export const removeFromCart = (id) => {
    return {
        type: "REMOVE_CART",
        payload: id
    }
}

export const addToFav = (id) => {
    return {
        type: "ADD_FAV",
        payload: id
    }
}

export const removeFromFav = (id) => {
    return {
        type: "REMOVE_FAV",
        payload: id
    }
}

export const searchGame = (title) => {
    return {
        type: "SEARCH_GAME",
        payload: title
    }
}

export const filterGamesTags = (tags) => {
    return {
        type: "FILTER_GAMES_TAGS",
        payload: tags
    }
}

export const creditCard = (data) => {
    return {
        type: "CREDIT_CARD",
        payload: data
    }
} 

export const creditCardErrors = (error) => {
    return {
        type: "CREDIT_CARD_ERRORS",
        payload: error
    }
}