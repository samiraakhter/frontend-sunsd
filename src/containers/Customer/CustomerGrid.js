import React, { Component } from 'react';
import { Grid, GridColumn as Column, GridToolbar, GridDetailRow } from '@progress/kendo-react-grid';
import { Link } from 'react-router-dom';
 import "@progress/kendo-theme-default/dist/all.css"


import classes from './CustomerGrid.css';
import cellWithEditing from './EditingCell';
import DialogContainer from './DialogContainer.jsx';
import RemoveDialog from './RemoveDialog.jsx';
import Axios from 'axios';

class DetailComponent extends GridDetailRow {
    render() {
        const dataItem = this.props.dataItem;
        return (
            <section>
                <p><strong>Last Name:</strong> {dataItem.LastName } </p>
                <p><strong>Is Active:</strong> {dataItem.IsActive ? "Yes" : 'No'} </p>
                <p><strong>Enterprise Name:</strong> {dataItem.EnterpriseName ? "Yes" : 'No'} </p>
                <p><strong>MobileNo:</strong> {dataItem.MobileNo}</p>
                <p><strong>Phone No:</strong> {dataItem.PhoneNo}</p>
                <p><strong>Route:</strong> {dataItem.Route.RouteName}</p>
                <p><strong>SalesManager:</strong> {dataItem.User.FirstName}</p>

            </section>
        );
    }
}

class CustomerGrid extends Component {
    state = {
        
        Customer: [],
        skip: 0, 
        take: 10,
        customerInEdit: undefined,
        customerInDelete: false,
        isloaded: false
    }
    componentDidMount() {
        Axios.get('http://localhost:64883/api/Customer')
        .then((response) => {
            
            return response.data;
            
        })
        .then(data => {
              
            
            this.setState({  Customer: data.Data });
            
  
        }).catch(error => {
            console.log(error);
          });
    }

    expandChange = (event) => {
        event.dataItem.expanded = !event.dataItem.expanded;
        this.forceUpdate();
    }
 

    pageChange = (event) => {
        this.setState({
            skip: event.page.skip,
            take: event.page.take
        });
    }
    
    edit = (dataItem) => {
        this.setState({ customerInEdit: this.cloneCustomer(dataItem) });
    }

    remove = (dataItem ) => {
        this.setState({ customerInDelete: this.cloneCustomer(dataItem) });
        
    }

    delete = () => {
        const dataItem = this.state.customerInDelete;
        const customers = this.state.Customer.slice();
        const index = customers.findIndex(p => p.Id === dataItem.Id);
        const itemId =  dataItem.Id;
        if (index !== -1) {
            customers.splice(index, 1);
            Axios.delete('http://localhost:64883/api/Customer/Delete', { params: { id: itemId } })
            .then(response => {
                console.log(response);
            }).catch(error => {
                console.log(error);
              });
            this.setState({
                Customer: customers,
                customerInDelete: undefined
            });
        }
    }
    
    save = () => {
        const dataItem = this.state.customerInEdit;
        const customers = this.state.Customer.slice();
        const itemId =  dataItem.Id;
        if (dataItem.CustomerID === undefined) {
            customers.unshift(this.newCustomer(dataItem));
        } else {
            const index = customers.findIndex(p => p.CustomerID === dataItem.CustomerID);
            customers.splice(index, 1, dataItem);
        }
        Axios({
            method: 'POST',
            url:'http://localhost:64883/api/Customer/Update',
            params: { id: itemId } ,
            data: dataItem,
        //     headers: {
        //      Accept: 'application/json',
        //      'Content-Type': 'multipart/form-data'
        // }
          
        })
        .then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
          });
        this.setState({
            Customer: customers,
            customerInEdit: undefined
        });
        
    }

    cancel = () => {
        this.setState({ customerInEdit: undefined });
        this.setState({ customerInDelete: false });
    }

    insert = () => {
        this.setState({ customerInEdit: { } });
    }


    render() {

        return (
            <div className = {classes.Customer}>
             <h2 className= {classes.Heading}>Customers</h2>
             
                <Grid
                    style={{ height: '420px' }}
                    // filterable={true}
                        sortable={true}
                        pageable={{ pageSizes: true }}
                        {...this.props}
                    data={this.state.Customer.slice(this.state.skip, this.state.take + this.state.skip)}
                    detail={DetailComponent}
                    expandField="expanded"
                    onExpandChange={this.expandChange}
                    skip={this.state.skip}
                    take={this.state.take}
                    total={this.state.Customer.length}
                    
                    onPageChange={this.pageChange}
                    
                >
                 <GridToolbar>
                    <div onClick={this.closeEdit}>
                        <button title="Add new" className="k-button k-primary"  >
                        { <Link  to="/addcustomer" >Add New</Link>}
                    </button>
                    </div>
                </GridToolbar >
                    <Column field="Id" title="ID" width="50px" />
                    <Column field="FirstName" title="Name"  />
                    <Column field="IsActive"
                        cell={(props) => (
                            <td>
                                <input disabled type="checkbox" checked={props.dataItem[props.field]} />
                            </td>
                        )} />
                        <Column field="User.FirstName" title="SalesManager"  />
                         <Column
                        title="Edit"
                        cell={cellWithEditing(this.edit, this.remove)}
                    />
                </Grid>
                {this.state.customerInEdit && <DialogContainer dataItem={this.state.customerInEdit} save={this.save} cancel={this.cancel}/>}
                {this.state.customerInDelete && <RemoveDialog dataItem={this.state.customerInDelete} delete={this.delete} cancel={this.cancel}/> }
            </div>
        );
    }
    dialogTitle() {
        return `${this.state.customerInEdit.CustomerID === undefined ? 'Add' : 'Edit'} customer`;
    }
    cloneCustomer(customer) {
        return Object.assign({}, customer);
    }
    newCustomer(source) {
        const newCustomer = {
            Id: this.generateId(),
            CustomerName: '',
            Instock: false,
            Discontinued: false
        };

        return Object.assign(newCustomer, source);
    }

    generateId() {
        let id = 1;
        this.state.Customer.forEach(p => { id = Math.max((p.Id || 0) + 1, id); });
        return id;
    }
}


export default CustomerGrid;