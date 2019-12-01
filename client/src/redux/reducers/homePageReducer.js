import { GET_NOW_PLAYING, GET_POPULAR, GET_TOP_RATED, GET_UPCOMING, GET_USER_GENRES, CLEAR_HOME_PAGE } from '../constants';

const homePageObject = {
    latest: [],
    nowPlaying: [],
    popular: [],
    topRated: [],
    upcoming: [],
    userContent: {
        genres: []
    }
}

export const homePageReducer = (state = homePageObject, action) => {
    switch(action.type){
        case GET_NOW_PLAYING :
            return {
                ...state,
                nowPlaying: action.payload.nowPlaying
            };
        case GET_POPULAR :
            return {...state, popular: action.payload.popular}
        case GET_TOP_RATED :
            return {...state, topRated: action.payload.topRated}
        case GET_UPCOMING :
            return {
                ...state, 
                upcoming: action.payload.upcoming
            };
        case GET_USER_GENRES :
            return {
                ...state, 
                userContent:{
                    genres: action.payload
                }
            }
        case CLEAR_HOME_PAGE :
            return homePageObject;
        default:
            return homePageObject;
    }
}