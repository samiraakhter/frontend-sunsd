import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Register.css';
import * as actions from '../../store/actions/index';

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
            email: {
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
            }
        },
        
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
                this.state.controls.password.value);
        }
        

        render(){
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
                    <Button btnType= "Success">Sign Up</Button>
                  
                    </form>
                    <Button 
                    btnType="Danger"> { <Link style={{ color: '#944317' , textDecoration: 'none'}} to="/login" >SWITCH TO LOGIN</Link>}</Button>
                
                </div>
              );
            }
}
const mapDispatchToProps = dispatch => {
    return {
        onRegister: (firstName,lastName,username, password) => dispatch(actions.register(firstName,lastName,username, password))
    };
};

const mapStateToProps = state => {
    return {
        loading: state.register.loading,
        error: state.register.error
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);