import * as actionTypes from './actionTypes';
import axios from 'axios';

export const registerStart = () => {
    return {
        type: actionTypes.REGISTER_START
    };
};

export const registerSuccess = ( userId) => {
    return {
        type: actionTypes.REGISTER_SUCCESS,
        userId: userId
    };
};

export const registerFail = (error) => {
    return {
        type: actionTypes.REGISTER_FAIL,
        error: error
    };
};

export const register = (firstName,lastName,username, password,ContactNo,email,ResidentialAddress,IsActive,selectedRole,Token) => {
    return dispatch => {
        dispatch(registerStart());
        const authData = {
            FirstName: firstName,
            LastName: lastName,
            Username: username,
            password: password,
            ContactNo: ContactNo,
            Email: email,
            ResidentialAddress: ResidentialAddress,
            IsActive: IsActive,
            RoleId: selectedRole,
            Token: Token,
        };
        console.log(authData);
        let url = 'http://localhost:64883/api/Users';
        axios.post(url+'/Create', authData)
          .then(response => {
            console.log(response);
            dispatch(registerSuccess( response.data.id));
          })
          .catch(err =>{
            dispatch(registerFail(err.response.data.message));
          });
    };
};