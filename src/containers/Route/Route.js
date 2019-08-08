import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import classes from './Route.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

import Input from '../../components/UI/Input/Input';
//import { Link } from 'react-router-dom';
import Axios from 'axios';
import { DatePicker } from '@progress/kendo-react-dateinputs'

class Route extends Component {
    state = {
        routeForm: {
            RouteName: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Route Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
          
            isRepeatable: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {key :1,value: null, displayValue: 'Is Repeatable'},
                        {key :2,value: true, displayValue: 'Yes'},
                        {key :3,value: false, displayValue: 'No'}
                    ]
                },
                value: 'Is Repeatable',
                validation: {},
                valid: true
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
            DateOfVisit: '',
            SalesPerson: [],
            selectedPerson: '',
        
    }
    componentDidMount() {
        let token = this.props.token;
        Axios.get("http://localhost:64883/api/Users/GetSalesman", { headers: {"Authorization" : `Bearer ${token}`} })
          .then((response) => {
            return response.data;
          })
          .then(data => {
              
            let dataFromApi = data.map(x => { return {value: x.Id, display: x.FirstName} })
            this.setState({  SalesPerson: [{value: '', display: 'Select a SalesPerson'}].concat(dataFromApi) });
  
        }).catch(error => {
            console.log(error);
          });
        }
        handleSubmit = (event) => {
            event.preventDefault();
            
            this.props.onRoute(this.state.routeForm.RouteName.value,
              
                this.state.routeForm.isRepeatable.value,
                this.state.routeForm.IsActive.value,
                this.state.DateOfVisit,
                this.state.selectedPerson,);
                
        }

        checkValidity(value, rules) {
            let isValid = true;
            if (!rules) {
                return true;
            }
            
            if (rules.required) {
                isValid = value.trim() !== '' && isValid;
            }
    
            if (rules.isNumeric) {
                const pattern = /^\d+$/;
                isValid = pattern.test(value) && isValid
            }
    
            return isValid;
        }
        inputChangedHandler = (event,controlName) => {
            const UpdatedRoute = {
                ...this.state.routeForm,
                [controlName]: {
                    ...this.state.routeForm[controlName],
                    value: event.target.value,
                    valid: this.checkValidity(event.target.value,this.state.routeForm[controlName].validation),
                    touched: true
                }
            };
                this.setState({routeForm : UpdatedRoute});
                
            }
            HandleChangePerson = (e) => {
                this.setState({selectedPerson : e.target.value});
                }
        
        handleSubmit = (event) => {
            event.preventDefault();
            
            this.props.onRoute(this.state.routeForm.RouteName.value,
              
                this.state.routeForm.isRepeatable.value,
                this.state.routeForm.IsActive.value,
                this.state.DateOfVisit,
                this.state.selectedPerson,);
                
        }
        handleChange = (event) => {
            this.setState({DateOfVisit:event.target.value})
            console.log(this.state.DateOfVisit);
        }
        render() {
            const today = new Date();
            let attachedClasses = [classes.Input, classes.InputElement];
        
            const formElementsArray = [];
            for (let key in this.state.routeForm) {
                formElementsArray.push({
                    id: key,
                    config: this.state.routeForm[key]
                });
            }
            let form = formElementsArray.map( formElement => (
                    
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
            return (
                <div className ={classes.Route}>
                     <h2>Enter your Route Data</h2>
            {errorMessage}
            <div style={{color: 'red', marginTop: '5px'}}>
          {this.state.validationError}
          </div>
                <form >
                {form}
                <span>Date Of Visit</span>
                                        <DatePicker
                                            width="100%"
                                            name="dateofvisit"
                                            required={true}
                                            min={today}
                                            onChange={this.handleChange}
                                        />
                <br/>
                <br />
                <select className={attachedClasses.join(' ')}  value={this.state.selectedPerson} 
                onChange={(e) => this.setState({selectedPerson: e.target.value, validationError: e.target.value === "" ? "You must select a product type" : ""})}>
                {this.state.SalesPerson.map((x,i) => <option key={i} value={x.value}>{x.display}</option>)}
        </select>

                </form>
                <button className={classes.Button} onClick={this.handleSubmit}>{ <Link  to="/route" >Add Route!</Link>} </button>

                </div>
                 );
                }
            }
            const mapDispatchToProps = dispatch => {
                return {
                    onRoute: (RouteName,isRepeatable,IsActive,DateOfVisit,selectedPerson) => dispatch(actions.route(RouteName,isRepeatable,IsActive,DateOfVisit,selectedPerson))
                };
            };
            
            const mapStateToProps = state => {
                return {
                    loading: state.product.loading,
                    error: state.product.error,
                    isAutheticated: state.auth.token !== null,
                    token: state.auth.token
                };
            };
            
            export default connect(mapStateToProps, mapDispatchToProps)(Route);
         