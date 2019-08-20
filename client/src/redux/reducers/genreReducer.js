const defaultGenreObject = {
    id: null,
    movies: [],
    page: null,
    filters: {}
}

export const genreReducer = (state = defaultGenreObject, action) => {
    switch(action.type){
        case "GET_SELECTED_GENRE" :
            return {
                id: action. payload.id,
                movies: action.payload.movies,
                page: action.payload.page
            }
        case "CLEAR_SELECTED_GENRE" :
            return defaultGenreObject;
        default :
            return defaultGenreObject;
    }
}