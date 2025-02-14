import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { alertsReducer } from './alertsReducer';
import { homePageReducer } from './homePageReducer';
import { loginReducer } from './loginReducer';
import { modalReducer } from './modalReducer';
import { registrationReducer } from './registrationReducer';
import { searchReducer } from './searchReducer';
import { selectedMovieReducer } from './selectedMovieReducer';
import { userReducer } from './userReducer';

export default combineReducers({
    alert: alertsReducer,
    homePage: homePageReducer,
    form: formReducer,
    login: loginReducer,
    modal: modalReducer,
    selectedMovie: selectedMovieReducer,
    registration: registrationReducer,
    search: searchReducer,
    user: userReducer
})