import { CLOSE_MODAL, SHOW_MODAL } from '../constants';

export const modalReducer = (state = {isOpen: false, props: {} }, action) => {
    switch(action.type){
        case CLOSE_MODAL :
            return { isOpen: false, props: {} };
        case SHOW_MODAL :
            return { isOpen: true, props: action.payload };
        default :
            return state;
    }
}