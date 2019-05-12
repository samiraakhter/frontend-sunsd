import * as actionTypes from './actionTypes';
import axios from 'axios';

export const productStart = () => {
    return {
        type: actionTypes.PRODUCT_START
    };
};

export const productSuccess = (id) => {
    return {
        type: actionTypes.PRODUCT_SUCCESS,
        Id: id
    };
};

export const productFail = (error) => {
    return {
        type: actionTypes.PRODUCT_FAIL,
        error: error
    };
};

export const product = (ProductName,Sku,Variants,OnHand,Fullfilled,Instock,IsActive,selectedCategory,selectedType,ProductImage) => {
    return dispatch => {
        dispatch(productStart());
        const productData = {
            ProductName: ProductName,
            Sku:Sku,
            Variants: Variants,
            OnHand: OnHand,
            Fullfilled: Fullfilled,
            Instock: Instock,
            IsActive: IsActive,
            ProductCategoryIdFk: selectedCategory,
            productTypeIdFk: selectedType,
            ProductImage: ProductImage
        };
        console.log(productData);

        let url = 'https://localhost:44331/api/Product';
        axios.post(url+'/Create', productData)
          .then(response => {

            console.log(response);
            dispatch(productSuccess( response.data.id));
          })
          .catch(err =>{
            dispatch(productFail(err.response.data.message));
          });
    };
};