
import React, { Component } from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Input } from '@progress/kendo-react-inputs';

import Axios from 'axios';

import classes from '../Product/Product.css';

export default class DialogContaincer extends Component {
  state ={
    productInEdit: this.props.dataItem || null,
    SalesManager: [],
         selectedManager:'',
         Route:[],
         selectedRoute:'',
  }
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
  render() {
    let attachedClasses = [classes.Input, classes.InputElement]
      return (
        <Dialog  height={600}
            onClose={this.props.cancel}
        >
            <form onSubmit={this.handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                First Name<br />
                <Input
                    type="text"
                    name="FirstName"
                    value={this.state.productInEdit.FirstName || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                First Name<br />
                <Input
                    type="text"
                    name="LastName"
                    value={this.state.productInEdit.LastName || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                EnterpriseName<br />
                <Input
                    type="text"
                    name="EnterpriseName"
                    value={this.state.productInEdit.EnterpriseName || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                Email<br />
                <Input
                    type="email"
                    name="Email"
                    value={this.state.productInEdit.Email || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                Address<br />
                <Input
                    type="text"
                    name="Address"
                    value={this.state.productInEdit.Address || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                MobileNo<br />
                <Input
                    type="text"
                    name="MobileNo"
                    value={this.state.productInEdit.MobileNo || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                PhoneNo<br />
                <Input
                    type="text"
                    name="PhoneNo"
                    value={this.state.productInEdit.PhoneNo || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                Latitude<br />
                <Input
                    type="text"
                    name="Latitude"
                    value={this.state.productInEdit.Latitude || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                Longitude<br />
                <Input
                    type="text"
                    name="Longitude"
                    value={this.state.productInEdit.Longitude || ''}
                    onChange={this.onDialogInputChange}
                />
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
                Sales Manager<br />
                <br/>
            
                <select className={attachedClasses.join(' ')}  value={this.state.selectedManager} 
                            
               onChange={(e) => this.onDialogInputChange + this.setState({selectedManager: e.target.value, validationError: e.target.value === "" ? "You must select a manager" : ""})}>
                
                {this.state.SalesManager.map((type,i) => <option key={i} value={type.value}>{type.display}</option>)}
        </select>      </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                Route<br />
                <br/>
            
                <select className={attachedClasses.join(' ')}  value={this.state.selectedRoute} 
                  
                   onChange={(e) => this.onDialogInputChange + this.setState({selectedRoute: e.target.value, validationError: e.target.value === "" ? "You must select a route" : ""})}
                   >
              
                {this.state.Route.map((cat,i) => <option key={i} value={cat.value}>{cat.display}</option>)}
                
                
        </select>      </label>
            </div>
            {/* <DropDownList
                    data={this.state.ProductCategory}
                    textField="text"
                    dataItemKey="id"
                    value={this.state.productInEdit.ProductCategory}
                    onChange={this.handleChange}
                /> */}
          

            
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

