import { UPDATE_USER, UPDATE_USER_PROFILE, CLEAR_USER } from '../constants';

const defaultUser = {
    profilePicture: {
      publicID: 'wn2d2wndipkglyggiyd0',
      secureURL: 'https://res.cloudinary.com/dkdqmpkfa/image/upload/v1567913079/wn2d2wndipkglyggiyd0.png'
    },
    watchlist: [],
    favourites: [],
    viewed: [],
    genres: [],
    _id: 0,
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    createdAt: "",
    updatedAt: "",
    recentActivity: [],
    recentlyVisited: [],
    reviews: []
}

export const userReducer = ( state = defaultUser, action ) => {
    switch(action.type){
        case UPDATE_USER :
            return action.payload;
        case UPDATE_USER_PROFILE :
            return action.payload;
        case CLEAR_USER :
            return {};
        default :
            return state;
    }
}