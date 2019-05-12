import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from './hoc/Layout/Layout';
import Login from './containers/Login/Login';
import Logout from './containers/Login/Logout/Logout';
import Register from './containers/Register/Register';
import Product from './containers/Product/Product';
import GetProduct from './containers/Product/GetProduct';

class App extends Component {

   render() {
    return (
      <div>
        <Layout>
        <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/logout" component={Logout} />
        <Route path="/addproduct" component={Product}/>
        <Route path="/product" component={GetProduct}/>
        </Switch>
        </Layout>
              </div>
    );
  }
}

export default App;
