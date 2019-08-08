
import React, { Component } from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';


import Axios from 'axios';

export default class DialogContaincer extends Component {
    units = [ "ml", "grams", "dozens" ];
  state ={
    itemInEdit: this.props.dataItem || null,
    Product:[],
    selectedProduct: ''
  }

  handleSubmit(event) {
      event.preventDefault();
  }

  onDialogInputChange = (event) => {
      let target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.props ? target.props.name : target.name;

      const edited = this.state.itemInEdit;
      edited[name] = value;

      this.setState({
          itemInEdit: edited
      });
  }

  onDropdownInputChange = (event) => {
    let target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value.value;
    const name = target.props ? target.props.name : target.name;

    const edited = this.state.itemInEdit;
    edited[name] = value;

    this.setState({
        itemInEdit: edited
    });
}
  componentDidMount() {
    Axios.get("http://localhost:64883/api/Product")
      .then((response) => {
        return response.data;
      })
      .then(data => {
          
        let dataFromApi = data.Data.map(x => { return {value: x.Id, display: x.ProductName} })
        this.setState({  Product: [{value: 0, display: 'Select a Product'}].concat(dataFromApi) });
        console.log(this.state.Product);
    }).catch(error => {
        console.log(error);
      });

       }
  render() {
    //let attachedClasses = [classes.Input, classes.InputElement]
      return (
        <Dialog  height={600}
            onClose={this.props.cancel}
        >
            <form onSubmit={this.handleSubmit}>
            <DropDownList
                    data={this.state.Product}
                  //  label="Select the Product"
                  //  dataItemKey="Id"
                  name="ProductFk"
                  textField="display"
                 // value={this.state.itemInEdit.ProductFk}
                  value={this.state.Product.find(c => c.value === this.state.itemInEdit.ProductFk)}
                  onChange={this.onDropdownInputChange}
                />
            {/* <div style={{ marginBottom: '1rem' }}>
                <label>
                Select Product
                <br/>
            
                <select className={attachedClasses.join(' ')}  value={this.state.selectedProduct} 
                            
               onChange={(e) => this.onDialogInputChange + this.setState({selectedProduct: e.target.value, validationError: e.target.value === "" ? "You must select a product type" : ""})
               +this.state.itemInEdit.ProductFk === this.state.selectedProduct}>
                
                {this.state.Product.map((type,i) => <option key={i} value={type.value}>{type.display}</option>)}
        </select>      </label>
            </div> */}
            <div style={{ marginBottom: '1rem' }}>
                <label>
                Amount<br />
                <Input
                    type="text"
                    name="Amount"
                    value={this.state.itemInEdit.Amount || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                Unit<br />
                <DropDownList
                     data={this.units} 
                    name="Unit"
                    value={this.state.itemInEdit.Unit || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label>
                Minimum Stock Level<br />
                <Input
                    type="text"
                    name="MinimumStockLevel"
                    value={this.state.itemInEdit.MinimumStockLevel || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label>
                Reorder Quantity<br />
                <Input
                    type="text"
                    name="ReorderQuantity"
                    value={this.state.itemInEdit.ReorderQuantity || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                Default Location<br />
                <Input
                    type="text"
                    name="DefaultLocation"
                    value={this.state.itemInEdit.DefaultLocation || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>
          
            <div>
                <label>
                <input
                    type="checkbox"
                    name="IsActive"
                    checked={this.state.itemInEdit.IsActive || false}
                    onChange={this.onDialogInputChange}
                />
                IsActive </label>
            </div>
           
            
            
                       
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

