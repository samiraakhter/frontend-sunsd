import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    Id: null,
    error: null,
    loading: false
};

const productStart = (state, action) => {
    return updateObject(state, {error:null , loading: true} );
};

const productSuccess = (state, action) => {
    return updateObject(state, {
        Id: action.Id,
        error: null,
        loading: false
    });
};

const productFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false
    });
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.PRODUCT_START: return productStart(state, action);
        case actionTypes.PRODUCT_SUCCESS: return productSuccess(state, action);
        case actionTypes.PRODUCT_FAIL: return productFail(state,action);
        default:
        return state;
    }
};

export default reducer; 