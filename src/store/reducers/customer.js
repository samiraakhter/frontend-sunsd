import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    Id: null,
    error: null,
    loading: false
};

const customerStart = (state, action) => {
    return updateObject(state, {error:null , loading: true} );
};

const customerSuccess = (state, action) => {
    return updateObject(state, {
        Id: action.Id,
        error: null,
        loading: false
    });
};

const customerFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false
    });
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.CUSTOMER_START: return customerStart(state, action);
        case actionTypes.CUSTOMER_SUCCESS: return customerSuccess(state, action);
        case actionTypes.CUSTOMER_FAIL: return customerFail(state,action);
        default:
        return state;
    }
};

export default reducer; 