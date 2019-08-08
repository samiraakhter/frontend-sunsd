
import React, { Component } from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Input } from '@progress/kendo-react-inputs';
import { DatePicker } from '@progress/kendo-react-dateinputs'


import Axios from 'axios';

import classes from './Route.css';

export default class DialogContaincer extends Component {
  state ={
    routeInEdit: this.props.dataItem || null,
    DateOfVisit: new Date(),
            SalesPerson: [],
            selectedPerson: '',
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

      const edited = this.state.routeInEdit;
      edited[name] = value;

      this.setState({
        routeInEdit: edited
      });
      
  }
  componentDidMount() {
    let token = localStorage.getItem('token');
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
  render() {
    const today = new Date();
    let attachedClasses = [classes.Input, classes.InputElement]
      return (
        <Dialog  height={450}
            onClose={this.props.cancel}
        >
            <form onSubmit={this.handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                Route Name<br />
                <Input
                    type="text"
                    name="RouteName"
                    value={this.state.routeInEdit.RouteName || ''}
                    onChange={this.onDialogInputChange}
                />
                </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                Date Of Visit
                <br />
                
                 <DatePicker
                                            width="100%"
                                            name="DateOfVisit"
                                            required={true}
                                            min={today}
                                          //  / onChange={this.handleChange}
                                          //  value={this.state.routeInEdit.DateOfVisit || ''}
                    onChange={this.onDialogInputChange}
                                        />
                
                </label>
            </div>
            
            
            <div>
                <label>
                
                <input
                    type="checkbox"
                    name="isActive"
                    checked={this.state.routeInEdit.isActive || false}
                    onChange={this.onDialogInputChange}
                />
               
               Is Active</label>
            </div>
            
            
            <div>
                <label>
                <input
                    type="checkbox"
                    name="isRepeatable"
                    checked={this.state.routeInEdit.isRepeatable || false}
                    onChange={this.onDialogInputChange}
                />
                Is Repeatable </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                SalesPerson<br />
                <br/>
            
                <select className={attachedClasses.join(' ')}  value={this.state.selectedPerson} 
                            
               onChange={(e) => this.onDialogInputChange + this.setState({selectedPerson: e.target.value, validationError: e.target.value === "" ? "You must select a Sales Person" : ""})}>
                
                {this.state.SalesPerson.map((type,i) => <option key={i} value={type.value}>{type.display}</option>)}
        </select>      </label>
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

