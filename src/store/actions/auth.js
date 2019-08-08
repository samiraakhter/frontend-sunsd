import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('Id');
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

        let url = 'http://localhost:64883//api/users';
        axios.post(url+'/authenticate', authData)
          .then(response => {
            console.log(response);
            localStorage.setItem('token',response.data.Token);
            localStorage.setItem('Id',response.data.Id);
            dispatch(authSuccess(response.data.Token, response.data.Id));
            dispatch(checkAuthTimeout(36000000));
            
          })
          .catch(err =>{
            
            dispatch(authFail(err.response.data.message));
          });
    };
};

export const authCheckState = () => {
        return dispatch => {
            const token = localStorage.getItem('token');
            if(!token) {
                dispatch (logout());
            }
            else {
                const Id = localStorage.getItem('Id');
                dispatch (authSuccess(token , Id));
            }
        }
}