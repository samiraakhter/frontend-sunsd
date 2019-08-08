import * as actionTypes from './actionTypes';
import axios from 'axios';

export const routeStart = () => {
    return {
        type: actionTypes.ROUTE_START
    };
};

export const routeSuccess = (id) => {
    return {
        type: actionTypes.ROUTE_SUCCESS,
        Id: id
    };
};

export const routeFail = (error) => {
    return {
        type: actionTypes.ROUTE_FAIL,
        error: error
    };
};

export const route = (RouteName,isRepeatable,IsActive,DateOfVisit,selectedPerson) => {
    return dispatch => {
        dispatch(routeStart());
        const routeData = {
            RouteName: RouteName,
            isRepeatable: isRepeatable,
            IsActive: IsActive,
            DateOfVisit: DateOfVisit,
            SalesPerson: selectedPerson,
        };
        console.log(routeData);
        let url = 'http://localhost:64883/api/Route';

        axios.post(url+'/Create', routeData)
          .then(response => {

            console.log(response);
            dispatch(routeSuccess( response.data.id));
          })
          .catch(err =>{
            dispatch(routeFail(err.response.data.message));
          });
    };
};