import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import classes from './Product.css';
import Axios from 'axios';
// import { Notification } from '@progress/kendo-popups-react-wrapper';



class Product extends Component {
    state = {
        productForm: {
            ProductName: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Product Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            Sku: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Sku'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            Variants: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Variants'
                },
                value: '',
                validation: {
                    required: true,
                   
                },
                valid: false,
                touched: false
            },
           
            OnHand: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {key :1,value: null, displayValue: 'OnHand'},
                        {key :2,value: true, displayValue: 'Yes'},
                        {key :3,value: false, displayValue: 'No'}
                    ]
                },
                value: 'OnHand',
                validation: {},
                valid: true
            },

            Fullfilled: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {key :1,value: null, displayValue: 'Fullfilled'},
                        {key :2,value: true, displayValue: 'Yes'},
                        {key :3,value: false, displayValue: 'No'}
                    ]
                },
                value: 'Fullfilled',
                validation: {},
                valid: true
            },

            Instock: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Instock'
                },
                value: '',
                validation: {
                    required: true,
                    isNumeric: true,
                   
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
         ProductType: [],
         selectedType:'',
         ProductCategory: [],
         selectedCategory: '',
        formIsValid: false,
        file: null,
        ProductImage:'',
        validationError: "",
        
    }
    componentDidMount() {
        Axios.get("http://localhost:64883/api/ProductType")
          .then((response) => {
            return response.data;
          })
          .then(data => {
              
            let typesFromApi = data.map(type => { return {value: type.Id, display: type.ProductTypeName} })
            this.setState({  ProductType: [{value: '', display: 'Select a Product Type'}].concat(typesFromApi) });
  
        }).catch(error => {
            console.log(error);
          });

          Axios.get("http://localhost:64883/api/ProductCategory")
          .then((response) => {
            return response.data;
          })
          .then(data => {
              
            let dataFromApi = data.map(cat => { return {value: cat.Id, display: cat.ProductCategoryName} })
            this.setState({  ProductCategory: [{value: 0, display: 'Select a Product Category'}].concat(dataFromApi) });
  
        }).catch(error => {
            console.log(error);
          });


      }
      
      fileChangedHandler = event => {
        this.setState({ file: event.target.files[0] })
      }

      uploadHandler = () => {
        const formData = new FormData()
        formData.append(
          'file',
          this.state.file,
          this.state.file.name
        )
              Axios({
            url: 'http://localhost:64883/api/Product/Temp',
            method: 'POST',
            data: formData,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((response) => {
            return response.data;
            
          })
          .then(data => {
            let Image = data
           
            this.setState({  ProductImage: Image });
            alert(this.state.ProductImage+ " Uploaded");
            //this.popUpNotificationWidget.show('success');
            
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
        const UpdatedProduct = {
            ...this.state.productForm,
            [controlName]: {
                ...this.state.productForm[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value,this.state.productForm[controlName].validation),
                touched: true
            }
        };
            this.setState({productForm : UpdatedProduct});
            
        }
        HandleChange = (e) => {
            this.setState({selectedType : e.target.value});
            }

        HandleChangeCategory = (e) => {
                // this.setState({selectedType: e.target.value, validationError: e.target.value === "" ? "You must select your product type" : ""});
                // console.log(e);
                this.state.selectedCategory = e.target.value;

            }

    submitHandler = (event) =>{
        event.preventDefault();
        this.props.onProduct(this.state.productForm.ProductName.value,
            this.state.productForm.Sku.value,
            this.state.productForm.Variants.value,
            this.state.productForm.OnHand.value,
            this.state.productForm.Fullfilled.value,
            this.state.productForm.Instock.value,
            this.state.productForm.IsActive.value,
            this.state.selectedCategory,
            this.state.selectedType,
            this.state.ProductImage
            );
            
    }

    render () {
        let attachedClasses = [classes.Input, classes.InputElement];
        const formElementsArray = [];
        for (let key in this.state.productForm) {
            formElementsArray.push({
                id: key,
                config: this.state.productForm[key]
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
            <div className ={classes.Product}>
           <h4>Enter your Product Data</h4>
            {errorMessage}
            <div style={{color: 'red', marginTop: '5px'}}>
          {this.state.validationError}
             </div>
                <form >
                {form}
                <br/>
                <select className={attachedClasses.join(' ')}  value={this.state.selectedType} 
                onChange={(e) => this.setState({selectedType: e.target.value, validationError: e.target.value === "" ? "You must select a product type" : ""})}>
                {this.state.ProductType.map((type,i) => <option key={i} value={type.value}>{type.display}</option>)}
        </select>
        <br/>
        <select className={attachedClasses.join(' ')}  value={this.state.selectedCategory} 
                onChange={(e)=>this.HandleChangeCategory(e)}>
          {this.state.ProductCategory.map((cat,i) => <option key={i} value={cat.value}>{cat.display}</option>)}
        </select>
        <br/>
                </form>
                <input  className={attachedClasses.join(' ')} type="file" onChange={this.fileChangedHandler} />
                <button className={classes.Button} onClick={this.uploadHandler}>Upload!</button>
                <br />

                <button className={classes.Button} onClick={this.submitHandler}>{ <Link  to="/product" >Add Product!</Link>} </button>
            
                </div>
                
         );
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onProduct: (ProductName,Sku,Variants,OnHand,Fullfilled,Instock,IsActive,selectedType,selectedCategory,ProductImage) => dispatch(actions.product(ProductName,Sku,Variants,OnHand,Fullfilled,Instock,IsActive,selectedType,selectedCategory,ProductImage))
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

export default connect(mapStateToProps, mapDispatchToProps)(Product);
