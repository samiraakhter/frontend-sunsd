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

export const register = (firstName,lastName,username, password) => {
    return dispatch => {
        dispatch(registerStart());
        const authData = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password
        };

        let url = 'https://localhost:44331/api/users';
        axios.post(url+'/CreateTestUser', authData)
          .then(response => {
            console.log(response);
            dispatch(registerSuccess( response.data.id));
          })
          .catch(err =>{
            dispatch(registerFail(err.response.data.message));
          });
    };
};