import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers,compose } from 'redux';
import thunk from 'redux-thunk';


import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import authReducer from './store/reducers/auth';
import registerReducer from './store/reducers/register';
import productReducer from './store/reducers/product';
import customerReducer from './store/reducers/customer';
import routeReducer from './store/reducers/route';
import inventoryReducer from './store/reducers/inventory';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    auth: authReducer,
    register: registerReducer,
    product: productReducer,
    customer: customerReducer,
    route: routeReducer,
    inventory: inventoryReducer
    
});

const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));

const app = (
    
    <Provider store={store}>        
    <BrowserRouter>
            <App />
        </BrowserRouter>
        </Provider>

    
);
ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
