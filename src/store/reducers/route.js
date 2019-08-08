import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    Id: null,
    error: null,
    loading: false
};

const routeStart = (state, action) => {
    return updateObject(state, {error:null , loading: true} );
};

const routeSuccess = (state, action) => {
    return updateObject(state, {
        Id: action.Id,
        error: null,
        loading: false
    });
};

const routeFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false
    });
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.ROUTE_START: return routeStart(state, action);
        case actionTypes.ROUTE_SUCCESS: return routeSuccess(state, action);
        case actionTypes.ROUTE_FAIL: return routeFail(state,action);
        default:
        return state;
    }
};

export default reducer; 