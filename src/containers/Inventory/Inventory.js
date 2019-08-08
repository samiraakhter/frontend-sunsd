import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import classes from './Inventory.css';
import Axios from 'axios';


class Inventory extends Component {
    state = {
        inventoryForm: {
            
            Amount: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Amount'
                },
                value: '',
                validation: {
                    required: true,
                    isNumeric: true,
                },
                valid: false,
                touched: false
            },
            Unit: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {key :1,value: null, displayValue: 'Select Unit'},
                        {key :2,value: 'ml', displayValue: 'ml'},
                        {key :3,value: 'grams', displayValue: 'grams'},
                        {key :4,value: 'dozen', displayValue: 'dozen'},
                    ]
                },
                value: 'OnHand',
                validation: {},
                valid: true
            },

            MinimumStockLevel: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter Minimum Stock Level'
                },
                value: '',
                validation: {
                    required: true,
                    isNumeric: true,
                },
                valid: false,
                touched: false
            },
            ReorderQuantity: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter Reorder Quantity'
                },
                value: '',
                validation: {
                    required: true,
                    isNumeric: true,
                },
                valid: false,
                touched: false
            },
            DefaultLocation: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter Default Location'
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
        },
         Product: [],
         selectedProduct:'',
         formIsValid: false,
         validationError: "",
        
    }
    componentDidMount() {
        Axios.get("http://localhost:64883/api/Product/GetAll")
          .then((response) => {
            return response.data;
          })
          .then(data => {
              
            let dataFromApi = data.map(x => { return {value: x.Id, display: x.ProductName} })
            this.setState({  Product: [{value: '', display: 'Select the Product'}].concat(dataFromApi) });
            console.log(this.state.Product);
        }).catch(error => {
            console.log(error);
          });

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
        const UpdatedInventory = {
            ...this.state.inventoryForm,
            [controlName]: {
                ...this.state.inventoryForm[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value,this.state.inventoryForm[controlName].validation),
                touched: true
            }
        };
            this.setState({inventoryForm : UpdatedInventory});
            
        }
        // HandleChange = (e) => {
        //     this.setState({selectedType : e.target.value});
        //          console.log(this.state.selectedProduct);
        //     }


    submitHandler = (event) =>{
        event.preventDefault();
        this.props.onInventory(
            this.state.inventoryForm.Amount.value,
            this.state.inventoryForm.Unit.value,
            this.state.inventoryForm.MinimumStockLevel.value,
            this.state.inventoryForm.ReorderQuantity.value,
            this.state.inventoryForm.DefaultLocation.value,
            this.state.inventoryForm.IsActive.value,
            this.state.selectedProduct,
            );
            console.log(this.state.selectedProduct);
            
    }

    render () {
        let attachedClasses = [classes.Input, classes.InputElement];
        const formElementsArray = [];
        for (let key in this.state.inventoryForm) {
            formElementsArray.push({
                id: key,
                config: this.state.inventoryForm[key]
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
         return(
            <div className ={classes.Inventory}>
           <h4>Enter your Inventory Data</h4>
            {errorMessage}
            <div style={{color: 'red', marginTop: '5px'}}>
          {this.state.validationError}
             </div>
                <form >
                    <br/>
                <select className={attachedClasses.join(' ')}  value={this.state.selectedProduct} 
                onChange={(e) => this.setState({selectedProduct: e.target.value, validationError: e.target.value === "" ? "You must select a product" : ""})}>
                {this.state.Product.map((type,i) => <option key={i} value={type.value}>{type.display}</option>)}
        </select>
        
                {form}
                </form>
                <button className={classes.Button} onClick={this.submitHandler}>{ <Link  to="/inventory" >Add Item!</Link>} </button>

                </div>
                
         );
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onInventory: (Amount,Unit,MinimumStockLevel,ReorderQuantity,DefaultLocation,IsActive,selectedProduct) => dispatch(actions.inventory(Amount,Unit,MinimumStockLevel,ReorderQuantity,DefaultLocation,IsActive,selectedProduct))
    };
};

const mapStateToProps = state => {
    return {
        loading: state.inventory.loading,
        error: state.inventory.error,
        isAutheticated: state.auth.token !== null,
        token: state.auth.token
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Inventory);
