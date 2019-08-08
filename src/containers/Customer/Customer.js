import React, { Component } from 'react';
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import RouteModal from './Route/RouteModal.jsx';
import classes from './Customer.css';
import Axios from 'axios';
import { Button } from '@progress/kendo-react-buttons'


class Customer extends Component {
    state = {
        showRoute: false,
        customerForm: {
            FirstName: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Customer First Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            LastName: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter Customer Last Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            EnterpriseName: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter the Enterprise Name'
                },
                value: '',
                validation: {
                    required: true,
                   
                },
                valid: false,
                touched: false
            },
            Email: {
                elementType: 'input',
                elementConfig:{
                    type: 'email',
                    placeholder: 'Enter Customer Email Here'
                },
                value: '',
                validation:{
                    required: false,
                    isEmail:true
                },
                valid: false,
                touched:false
            },
            Address: { 
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter the Address'
                },
                value: '',
                validation: {
                    required: true,
                   
                },
                valid: false,
                touched: false
            },
            PhoneNo: {
                elementType: 'input',
                elementConfig:{
                    type: 'numeric',
                    placeholder: 'Enter Customer Phone Number Here'
                },
                value: '',
                validation:{
                    required: false,
                   
                },
                valid: false,
                touched:false
            },
            MobileNo: {
                elementType: 'input',
                elementConfig:{
                    type: 'numeric',
                    placeholder: 'Enter Customer Mobile Number Here'
                },
                value: '',
                validation:{
                    required: false,
                   
                },
                valid: false,
                touched:false
            },
            
            Longitude: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter the Longitude'
                },
                value: '',
                validation: {
                    required: true,
                   
                },
                valid: false,
                touched: false
            },
            Latitude: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter the Latitude'
                },
                value: '',
                validation: {
                    required: true,
                   
                },
                valid: false,
                touched: false
            },
            IsActive: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {key :1,value: null, displayValue: 'IsActive'},
                        {key :2,value: true, displayValue: 'Yes'},
                        {key :3,value: false, displayValue: 'No'}
                    ]
                },
                value: 'Is Active',
                validation: {},
                valid: true
            },
            PaymentMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {key :1,value: null, displayValue: 'Payment Method'},
                        {key :2,value: 'Cash', displayValue: 'Cash'},
                        {key :3,value: 'Mobile Payments', displayValue: 'Mobile Payments'},
                        {key :4,value: 'Bank Transfers', displayValue: 'Bank Transfers'}
                    ]
                },
                value: 'Is Active',
                validation: {},
                valid: true
            },
        },
         SalesManager: [],
         selectedManager:'',
         Route:[],
         selectedRoute:'',
        formIsValid: false,
        validationError: "",
        showModal:false
        
    }
    componentDidMount() {
        let token = this.props.token;
        Axios.get("http://localhost:64883/api/Users/GetSalesManager", { headers: {"Authorization" : `Bearer ${token}`} })
          .then((response) => {
            return response.data;
            
          })
          .then(data => {
              
            let users = data.map(x => { return {value: x.Id, display: x.FirstName} })
            this.setState({  SalesManager: [{value: '', display: 'Select a SalesManager'}].concat(users) });
                console.log(this.state.SalesManager);
        }).catch(error => {
            console.log(error);

          });

          Axios.get("http://localhost:64883/api/Route/GetAll"
        //    { headers: {"Authorization" : `Bearer ${token}`}}
     )
          .then((response) => {
            return response.data;
            
          })
          .then(data => {
              
            let routes = data.map(x => { return {value: x.Id, display: x.RouteName} })
            this.setState({  Route: [{value: '', display: 'Select a Route'}].concat(routes) });
                console.log(this.state.Route);
        }).catch(error => {
            console.log(error);

          });
      }

    //   routeHandler=()=> {
    //       this.setState({showRoute:true});
    //   }
      checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }
    
    inputChangedHandler = (event,controlName) => {
        const UpdatedControls = {
            ...this.state.customerForm,
            [controlName]: {
                ...this.state.customerForm[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value,this.state.customerForm[controlName].validation),
                touched: true
            }
        };
            this.setState({customerForm : UpdatedControls});
        }

        submitHandler = (event) =>{
            event.preventDefault();
            this.props.onCustomer(
                this.state.customerForm.FirstName.value,
                this.state.customerForm.LastName.value,
                this.state.customerForm.EnterpriseName.value,
                this.state.customerForm.Email.value,
                this.state.customerForm.Address.value,
                this.state.customerForm.PhoneNo.value,
                this.state.customerForm.MobileNo.value,
                this.state.customerForm.Latitude.value,
                this.state.customerForm.Longitude.value,
                this.state.customerForm.IsActive.value,
                this.state.customerForm.PaymentMethod.value,
                this.state.selectedManager,
                this.state.selectedRoute);
        }
        cancel = () => {
            this.setState({ showModal: false });
        }    

        render(){
            let attachedClasses = [classes.Input, classes.InputElement];
            const formElementArray = [];
            for (let key in this.state.customerForm) {
                formElementArray.push({
                    id: key,
                    config: this.state.customerForm[key]
                });
            }
            let form = formElementArray.map( formElement => (
                
                <Input 
                
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) => this.inputChangedHandler(event, formElement.id)} />
      
            ));
            if(this.props.loading) {
                form = <Spinner />
             }

             let errorMessage = null;

             if(this.props.error) {
                 errorMessage = (
                     <p>{this.props.error}</p>
                 );
             }

            return(
                <div className ={classes.Customer}>
                <h2 className= {classes.Heading}>Add New Customer</h2>
                {errorMessage}
                    <form onSubmit={this.submitHandler}>
                    {form}
                       
                    <br/>
                <select className={attachedClasses.join(' ')}  value={this.state.selectedManager} 
                onChange={(e) => this.setState({selectedManager: e.target.value, validationError: e.target.value === "" ? "You must select a SalesManager" : ""})}>
                {this.state.SalesManager.map((x,i) => <option key={i} value={x.value}>{x.display}</option>)}
                </select>
                <br/>
                <table>
                    <tbody>
                <tr>
              { <td width="100%"> <select  className={attachedClasses.join(' ')}  value={this.state.selectedRoute} 
                onChange={(e) => this.setState({selectedRoute: e.target.value, validationError: e.target.value === "" ? "You must select a Route" : ""})}>
                {this.state.Route.map((x,i) => <option key={i} value={x.value}>{x.display}</option>)}
                </select> </td> }
                {<td><Button icon="add" onClick={() => this.setState({showModal: true})}></Button> </td>}
                </tr>
                </tbody>
                </table>
                <br/>
                <button className={classes.Button} onClick={this.submitHandler}>Add Customer</button>
                    </form>
                   { this.state.showModal && <RouteModal cancel={this.cancel} save = {this.cancel}/>}
                </div>
              );
            }
}
const mapDispatchToProps = dispatch => {
    return {
        onCustomer: (FirstName,LastName,EnterpriseName, Email,Address,PhoneNo,MobileNo,Longitude,Latitude,IsActive,PaymentMethod,selectedManager,selectedRoute) => dispatch(actions.customer(FirstName,LastName,EnterpriseName, Email,Address,PhoneNo,MobileNo,Longitude,Latitude,IsActive,PaymentMethod,selectedManager,selectedRoute))
    };
};

const mapStateToProps = state => {
    return {
        loading: state.customer.loading,
        error: state.customer.error,
        isAutheticated: state.auth.token !== null,
        token: state.auth.token
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Customer);
