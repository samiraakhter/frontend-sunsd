import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    Id: null,
    error: null,
    loading: false
};

const inventoryStart = (state, action) => {
    return updateObject(state, {error:null , loading: true} );
};

const inventorySuccess = (state, action) => {
    return updateObject(state, {
        Id: action.Id,
        error: null,
        loading: false
    });
};

const inventoryFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false
    });
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.INVENTORY_START: return inventoryStart(state, action);
        case actionTypes.INVENTORY_SUCCESS: return inventorySuccess(state, action);
        case actionTypes.INVENTORY_FAIL: return inventoryFail(state,action);
        default:
        return state;
    }
};

export default reducer; 