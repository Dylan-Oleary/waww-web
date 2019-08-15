export const selectedMovieReducer = (selectedMovie = null, action) => {
    switch(action.type){
        case 'GET_SELECTED_MOVIE':
            return action.payload;
        case 'CLEAR_SELECTED_MOVIE':
            return null
        default:
            return selectedMovie;
    }
}