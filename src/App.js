import React, { Component } from 'react';
import { Route, Switch, withRouter , Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Axios from 'axios';
import {Splitter } from '@progress/kendo-react-layout'

import Layout from './hoc/Layout/Layout';
import Login from './containers/Login/Login';
import Logout from './containers/Login/Logout/Logout';
import Register from './containers/Register/Register';
import Product from './containers/Product/Product';
import GetProduct from './containers/Product/GetProduct';
import Customer from './containers/Customer/Customer';
import AddRoute from './containers/Route/Route';
import GetRoute from './containers/Route/GetRoute.js';
import * as actions from './store/actions/index';
import MenuNavContainer from './components/Navigation/MenuNavContainer.jsx';
import Inventory from './containers/Inventory/Inventory';
import GetInventory from './containers/Inventory/GetInventory';
// import Charts from './containers/Dashboard/Charts.jsx';
import OrderGrid from './containers/Order/OrderGrid';
import Dashboard from './containers/Dashboard/Dashboard.jsx';
import CustomerGrid from './containers/Customer/CustomerGrid';


class App extends Component {
  
  state = {
    users : [],
    horizontalPanes: [
      { min: '20px', size: '20%',  collapsible: true },
      { min: '20px' },
  ],
  authenticated: false
  }
  componentWillMount() {
    this.Authentication();
  }
    
    Authentication = () =>{
      this.setState({authenticated: localStorage.getItem('token')!=null});
      console.log('test');
    }

  componentDidMount() {
    this.props.onTryAutoSignup();
    Axios.get("http://localhost:64883/api/Users/GetCount")
    .then((response) => {
      return response.data;

    })
    .then(data => {
      this.setState({users : data});
      console.log(this.state.users)  
      
  }).catch(error => {
      console.log(error);
    });
  }

  onHorizontalLayoutChange = (updatedState) => {
    this.setState({
        horizontalPanes: updatedState
    });
}
  render() {
   
   
     let routes = (undefined);
     if(!this.state.authenticated) {
      routes = (
        <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Redirect to= "/login" />
        </Switch>
       );
     }
    
     if(this.props.isAuthenticated) {
       routes = (
        <Switch>
      
        <Route path="/register" component={Register} />
        <Route path="/logout" component={Logout} />
        <Route path="/addproduct" component={Product}/>
        <Route path="/product" component={GetProduct}/>
        <Route path="/additem" component={Inventory}/>
        <Route path="/inventory" component={GetInventory}/>
        <Route path="/addcustomer" component={Customer}/>
        <Route path='/customers' component={CustomerGrid} />
        <Route path="/addroute" component={AddRoute}/>
        <Route path="/route" component={GetRoute}/>
        <Route path='/orders' component={OrderGrid} />
        <Route exact path='/' component={Dashboard} />
        {/* <Route exact path='/' component={Charts} /> */}
        

        </Switch>
       );
       }

       let toRegister = (
        null
       );
       if(this.state.users === 0)
       {
         toRegister = (
          <Redirect to= "/register" />
         );}

         let LeftPane = (
          <div>
           <p>
           <b>Login to view menu</b>
           </p>
          </div>
         );

         if(this.props.isAuthenticated) {
         LeftPane = (
            <MenuNavContainer/>
           );
         }
        
         if(!this.props.isAuthenticated) {
          return (
            <div>
            <Layout>
                        {routes}
                        {toRegister}  
            </Layout>
                  </div>
        );
        }
       
     
    return (
      <div>
        <Layout>
        <Splitter
                    style={{height: 650}}
                    panes={this.state.horizontalPanes}
                    onLayoutChange={this.onHorizontalLayoutChange}
                >
                    <div>
                      {LeftPane}
                    </div>
                    {routes}
                    {toRegister}  
                </Splitter>
        
        
        </Layout>
              </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
