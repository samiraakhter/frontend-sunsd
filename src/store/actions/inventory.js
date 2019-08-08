import * as actionTypes from './actionTypes';
import axios from 'axios';

export const inventoryStart = () => {
    return {
        type: actionTypes.INVENTORY_START
    };
};

export const inventorySuccess = (id) => {
    return {
        type: actionTypes.INVENTORY_SUCCESS,
        Id: id
    };
};

export const inventoryFail = (error) => {
    return {
        type: actionTypes.INVENTORY_FAIL,
        error: error
    };
};

export const inventory = (Amount,Unit,MinimumStockLevel,ReorderQuantity,DefaultLocation,IsActive,selectedProduct) => {
    return dispatch => {
        dispatch(inventoryStart());
        const inventoryData = {
           
            Amount: Amount,
            Unit: Unit,
            MinimumStockLevel: MinimumStockLevel,
            ReorderQuantity: ReorderQuantity,
            DefaultLocation: DefaultLocation,
            IsActive: IsActive,
            ProductFk: selectedProduct,
           
        };
        console.log(inventoryData);
        let url = 'http://localhost:64883/api/Inventory';

        axios.post(url+'/Create', inventoryData)
          .then(response => {

            console.log(response);
            dispatch(inventorySuccess( response.data.id));
          })
          .catch(err =>{
            dispatch(inventoryFail(err.response.data.message));
          });
    };
};