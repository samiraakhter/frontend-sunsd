import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false
};

const registerStart = (state, action) => {
    return updateObject(state, {error:null , loading: true} );
};

const registerSuccess = (state, action) => {
    return updateObject(state, {
        userId: action.userId,
        error: null,
        loading: false
    });
};

const registerFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false
    });
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.REGISTER_START: return registerStart(state, action);
        case actionTypes.REGISTER_SUCCESS: return registerSuccess(state, action);
        case actionTypes.REGISTER_FAIL: return registerFail(state,action);
        default:
        return state;
    }
};

export default reducer; 