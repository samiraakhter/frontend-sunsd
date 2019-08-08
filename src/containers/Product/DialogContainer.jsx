
import React, { Component } from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Input } from '@progress/kendo-react-inputs';
// import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Upload } from '@progress/kendo-react-upload';

import Axios from 'axios';

import classes from './Product.css';

export default class DialogContaincer extends Component {
  state ={
    productInEdit: this.props.dataItem || null,
    ProductType:[],
    ProductCategory: [],
    selectedCategory: '',
    selectedType: ''
  }
//     constructor(props) {
//       super(props);
//       this.state = {
         
//       };
//   }
  handleSubmit(event) {
      event.preventDefault();
  }

  onDialogInputChange = (event) => {
      let target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.props ? target.props.name : target.name;

      const edited = this.state.productInEdit;
      edited[name] = value;

      this.setState({
          productInEdit: edited
      });
      
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
  render() {
    let attachedClasses = [classes.Input, classes.InputElement]
      return (
        <Dialog  height={600}
            onClose={this.props.cancel}
        >
            <form onSubmit={this.handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                Product Name<br />
                <Input
                    type="text"
                    name="ProductName"
                    value={this.state.productInEdit.ProductName || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                Sku<br />
                <Input
                    type="text"
                    name="Sku"
                    value={this.state.productInEdit.Sku || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                Variants<br />
                <Input
                    type="text"
                    name="Variants"
                    value={this.state.productInEdit.Variants || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>
            
            <div>
                <label>
                <input
                    type="checkbox"
                    name="Instock"
                    checked={this.state.productInEdit.Instock || false}
                    onChange={this.onDialogInputChange}
                />
                Instock
                                </label>
            </div>
            <div>
                <label>
                <input
                    type="checkbox"
                    name="Fullfilled"
                    checked={this.state.productInEdit.Fullfilled || false}
                    onChange={this.onDialogInputChange}
                />
                Fullfilled
                                </label>
            </div>
            <div>
                <label>
                <input
                    type="checkbox"
                    name="OnHand"
                    checked={this.state.productInEdit.OnHand || false}
                    onChange={this.onDialogInputChange}
                />
                OnHand
                                </label>
            </div>
            <div>
                <label>
                <input
                    type="checkbox"
                    name="IsActive"
                    checked={this.state.productInEdit.IsActive || false}
                    onChange={this.onDialogInputChange}
                />
                IsActive </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                Product Type<br />
                <br/>
            
                <select className={attachedClasses.join(' ')}  value={this.state.selectedType} 
                            
               onChange={(e) => this.onDialogInputChange + this.setState({selectedType: e.target.value, validationError: e.target.value === "" ? "You must select a product type" : ""})}>
                
                {this.state.ProductType.map((type,i) => <option key={i} value={type.value}>{type.display}</option>)}
        </select>      </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                Product Category<br />
                <br/>
            
                <select className={attachedClasses.join(' ')}  value={this.state.selectedCategory} 
                  
                   onChange={(e) => this.onDialogInputChange + this.setState({selectedCategory: e.target.value, validationError: e.target.value === "" ? "You must select a product category" : ""})}
                   >
              
                {this.state.ProductCategory.map((cat,i) => <option key={i} value={cat.value}>{cat.display}</option>)}
                
                
        </select>      </label>
            </div>
            {/* <DropDownList
                    data={this.state.ProductCategory}
                    textField="text"
                    dataItemKey="id"
                    value={this.state.productInEdit.ProductCategory}
                    onChange={this.handleChange}
                /> */}
            <Upload
                batch={false}
                multiple={false}
                defaultFiles={[
                    { name: this.state.productInEdit.ProductImage }
                ]}
                onChange={this.onDialogInputChange}
                withCredentials={false}
                // saveUrl={'https://demos.telerik.com/kendo-ui/service-v4/upload/save'}
                // removeUrl={'https://demos.telerik.com/kendo-ui/service-v4/upload/remove'}
            />

            
            </form>
            <DialogActionsBar>
            <button
                className="k-button"
                onClick={this.props.cancel}
            >
                Cancel
                            </button>
            <button
                className="k-button k-primary"
                onClick={this.props.save}
            >
                Save
                            </button>
            </DialogActionsBar>
        </Dialog>
    );
  }
}

