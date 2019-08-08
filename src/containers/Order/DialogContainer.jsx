
import React, { Component } from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';



export default class DialogContaincer extends Component {
  state ={
    itemInEdit: this.props.dataItem || null,
  
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
//   componentDidMount() {
//     Axios.get("http://localhost:64883/api/Order")
//       .then((response) => {
//         return response.data;
//       })
//       .then(data => {
          
//         let dataFromApi = data.Data.map(x => { return {value: x.Id, display: x.ProductName} })
//         this.setState({  Product: [{value: 0, display: 'Select a Product'}].concat(dataFromApi) });
//         console.log(this.state.Product);
//     }).catch(error => {
//         console.log(error);
//       });

//        }
  render() {
    //let attachedClasses = [classes.Input, classes.InputElement]
      return (
        <Dialog  
            onClose={this.props.cancel}
        >
            <form onSubmit={this.handleSubmit}>
           
        
            
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
            <div>
                <label>
                <input
                    type="checkbox"
                    name="IsConfirmed"
                    checked={this.state.itemInEdit.IsConfirmed || false}
                    onChange={this.onDialogInputChange}
                />
               Is Confirmed</label>
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

