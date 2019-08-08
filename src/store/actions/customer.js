import * as actionTypes from './actionTypes';
import axios from 'axios';

export const customerStart = () => {
    return {
        type: actionTypes.CUSTOMER_START
    };
};

export const customerSuccess = (id) => {
    return {
        type: actionTypes.CUSTOMER_SUCCESS,
        Id: id
    };
};

export const customerFail = (error) => {
    return {
        type: actionTypes.CUSTOMER_FAIL,
        error: error
    };
};

export const customer = (FirstName,LastName,EnterpriseName, Email,Address,PhoneNo,MobileNo,Longitude,Latitude,IsActive,PaymentMethod,selectedManager,selectedRoute) => {
    return dispatch => {
        dispatch(customerStart());
        const customerData = {
            FirstName: FirstName,
            LastName: LastName,
            EnterpriseName: EnterpriseName,
            Email:Email,
            Address: Address,
            PhoneNo: PhoneNo,
            MobileNo:MobileNo,
            Longitude: Longitude,
            Latitude: Latitude,
            IsActive: IsActive,
            PaymentMethod: PaymentMethod,
            FK_SalesManager: selectedManager,
            FK_RouteId: selectedRoute,
            
        };
        console.log(customerData);
        let url = 'http://localhost:64883/api/Customer';

        axios.post(url+'/Create', customerData)
          .then(response => {

            console.log(response);
            dispatch(customerSuccess( response.data.id));
          })
          .catch(err =>{
            dispatch(customerFail(err.response.data.message));
          });
    };
};