import expressServer from '../../../api';

export const clearHomePage = () => {
    return { type: "CLEAR_HOME_PAGE" };
}

export const getUserGenres = genres => {
    return async dispatch => {
        Promise.all(genres.map( genre => {
            return expressServer.get(`/api/genres/${genre.id}`).then( response => response.data ).catch( err => console.log("err") )
        })).then( response => {
            const userGenres = response.map( (genre, index) => {
                return {
                    id: genre.id,
                    movies: genre.movies,
                    name: genres[index].name
                }
            })

            dispatch({ type: "GET_USER_GENRES", payload: userGenres });
        }).catch( err => {

        })
    }
}
