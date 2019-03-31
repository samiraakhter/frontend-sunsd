import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() =>{
            dispatch(logout());
        },expirationTime);
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const auth = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            username: username,
            password: password
        };

        let url = 'https://localhost:44331/api/users';
        axios.post(url+'/authenticate', authData)
          .then(response => {
            console.log(response);
            dispatch(authSuccess(response.data.token, response.data.id));
            dispatch(checkAuthTimeout(3600000))
          })
          .catch(err =>{
            
            dispatch(authFail(err.response.data.message));
          });
    };
};