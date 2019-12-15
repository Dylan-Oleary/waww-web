import { GET_CLASSICS, GET_HOMEPAGE_CONTENT, GET_NOW_PLAYING, GET_POPULAR, GET_TOP_RATED, GET_UPCOMING, GET_USER_GENRES, CLEAR_HOME_PAGE } from '../constants';

const homePageObject = {
    latest: [],
    nowPlaying: [],
    popular: [],
    topRated: [],
    upcoming: [],
    classics: [],
    isLoading: true,
    hasError: false,
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
        case GET_HOMEPAGE_CONTENT: 
            return {
                ...state,
                nowPlaying: action.payload.nowPlaying,
                popular: action.payload.popular,
                topRated: action.payload.topRated,
                upcoming: action.payload.upcoming,
                classics: action.payload.classics,
                isLoading: false
            }
        case GET_POPULAR :
            return {...state, popular: action.payload.popular}
        case GET_TOP_RATED :
            return {...state, topRated: action.payload.topRated}
        case GET_UPCOMING :
            return {
                ...state, 
                upcoming: action.payload.upcoming
            };
        case GET_CLASSICS :
            return {
                ...state,
                classics: action.payload.classics
            }
        case GET_USER_GENRES :
            return {
                ...state, 
                userContent:{
                    genres: action.payload
                }
            }
        case CLEAR_HOME_PAGE :
            return homePageObject;
        case "HOMEPAGE_ERROR":
            return {
                ...state,
                isLoading: false,
                hasError: true
            }
        default:
            return homePageObject;
    }
}