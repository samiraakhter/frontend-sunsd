import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Register.css';
import * as actions from '../../store/actions/index';
import Axios from 'axios';

class Register extends Component {
    state ={
        
        controls:{
            firstName: {
                elementType: 'input',
                elementConfig:{
                    placeholder: 'Enter Your First Name Here'
                },
                value: '',
                validation:{
                    
                    required: true,
                    
                },
                valid: false,
                touched:false
            },
            lastName: {
                elementType: 'input',
                elementConfig:{
                    placeholder: 'Enter Your Last Name Here'
                },
                value: '',
                validation:{
                    required: true,
                },
                valid: false,
                touched:false
            },
            
            username: {
                elementType: 'input',
                elementConfig:{
                    
                    placeholder: 'Enter Your Username Here'
                },
                value: '',
                validation:{
                    required: true,
                    },
                valid: false,
                touched:false
            },
            
            password:{
                elementType: 'input',
                elementConfig:{
                    type: 'password',
                    placeholder: 'Enter Your password Here'
                },
                value: '',
                validation:{
                    required: true,
                    minLength: 8
                },
                valid: false,
                touched:false
            },

            ContactNo: {
                elementType: 'input',
                elementConfig:{
                    placeholder: 'Enter Contact Number'
                },
                value: '',
                validation:{
                    maxLength: 11,
                    isNumeric:true,
                    required: true,
                },
                valid: false,
                touched:false
            },

            Email: {
                elementType: 'input',
                elementConfig:{
                    type: 'email',
                    placeholder: 'Enter Your Email Here'
                },
                value: '',
                validation:{
                    required: false,
                    isEmail:true
                },
                valid: false,
                touched:false
            },

            ResidentialAddress: {
                elementType: 'input',
                elementConfig:{
                    placeholder: 'Enter Address Here'
                },
                value: '',
                validation:{
                    required: true,
                },
                valid: false,
                touched:false
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

        },
        Roles: [],
        selectedRole:'',
        
    }
    componentDidMount() {
        Axios.get("http://localhost:64883/api/Role")
          .then((response) => {
            return response.data;
          })
          .then(data => {
              
            let roles = data.map(role => { return {value: role.Id, display: role.RoleName} })
            this.setState({  Roles: [{value: '', display: 'Select a Role'}].concat(roles) });
  
        }).catch(error => {
            console.log(error);
          });
      }

      HandleChange = (e) => {
        this.setState({selectedRole : e.target.value});
        }

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
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value,this.state.controls[controlName].validation),
                touched: true
            }
        };
            this.setState({controls : UpdatedControls});
        }

        submitHandler = (event) =>{
            event.preventDefault();
            this.props.onRegister(this.state.controls.firstName.value,
                this.state.controls.lastName.value,
                this.state.controls.username.value,
                this.state.controls.password.value,
                this.state.controls.ContactNo.value,
                this.state.controls.Email.value,
                this.state.controls.ResidentialAddress.value,
                this.state.controls.IsActive.value,
                this.state.selectedRole,
                localStorage.getItem('token'));
        }
        

        render(){
            let attachedClasses = [classes.Input, classes.InputElement];
            const formElementArray = [];
            for (let key in this.state.controls) {
                formElementArray.push({
                    id: key,
                    config: this.state.controls[key]
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
                <div className ={classes.Register}>
                <h2 className= {classes.Heading}>Sign Up</h2>
                {errorMessage}
                    <form onSubmit={this.submitHandler}>
                    {form}
                    <br/>  <select className={attachedClasses.join(' ')}  value={this.state.selectedRole} 
                onChange={(e) => this.setState({selectedRole: e.target.value, validationError: e.target.value === "" ? "You must select a role" : ""})}>
                {this.state.Roles.map((role,i) => <option key={i} value={role.value}>{role.display}</option>)}
        </select><br/>
                   
                    </form>
                    <button className={classes.Button} onClick={this.submitHandler} >{ <Link style={{ color: '#944317' , textDecoration: 'none'}} to="/" >Craete User</Link>}</button>
                   
                   <br/> <Button 
                    btnType="Danger"> { <Link style={{ color: '#944317' , textDecoration: 'none'}} to="/login" >SWITCH TO LOGIN</Link>}</Button>
                
                </div>
              );
            }
}
const mapDispatchToProps = dispatch => {
    return {
        onRegister: (firstName,lastName,username, password,ContactNo,email,ResidentialAddress,IsActive,selectedRole,Token) => dispatch(actions.register(firstName,lastName,username, password,ContactNo,email,ResidentialAddress,IsActive,selectedRole,Token))
    };
};

const mapStateToProps = state => {
    return {
        loading: state.register.loading,
        error: state.register.error
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);