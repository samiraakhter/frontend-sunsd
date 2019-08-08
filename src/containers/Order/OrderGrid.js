import React, { Component } from 'react';
import { Grid, GridColumn as Column, GridToolbar, GridDetailRow } from '@progress/kendo-react-grid';
import { Link } from 'react-router-dom';
 import "@progress/kendo-theme-default/dist/all.css"


import classes from './OrderGrid.css';
import cellWithEditing from './EditingCell';
import DialogContainer from './DialogContainer.jsx';
import RemoveDialog from './RemoveDialog.jsx';
import Axios from 'axios';

class DetailComponent extends GridDetailRow {
    state = { 
        lines:[]
    }

    componentDidMount() {

        const dataItem = this.props.dataItem;
        Axios.get('http://localhost:64883/api/Orderlines/GetOrder', { params: { id: dataItem.Id } })
        .then((response) => {
            
            return response.data;
            
        })
        .then(data => {
              
            
            this.setState({  lines: data.Data });
            console.log(this.state.lines);
            
  
        }).catch(error => {
            console.log(error);
          });

    }
    
    render() {
      //  const dataItem = this.props.dataItem;
        const data = this.state.lines;
        if (data) {
            return (
                <Grid data={data}>
                    <Column field="Id" title="Orderline Id" width="120px" />
                    <Column field="Product.ProductName" title="Product" />
                    <Column field="Quantity" title="Quantity" />
                    <Column field="Price" title="Price" format="{0:c}" />
                    <Column field="TotalPrice" title="Total Price" format="{0:c}" />
                </Grid>
            );
        }
        return (
            <div style={{ height: "50px", width: '100%' }}>
                <div style={{ position: 'absolute', width: '100%' }}>
                    <div className="k-loading-image" />
                </div>
            </div>
        );
    }
}

class OrderGrid extends Component {
    state = {
        
        Order: [],
        skip: 0, 
        take: 10,
        orderInEdit: undefined,
        orderInDelete: false,
        isloaded: false
    }
    componentDidMount() {
        Axios.get('http://localhost:64883/api/Order')
        .then((response) => {
            
            return response.data;
            
        })
        .then(data => {
              
            
            this.setState({  Order: data.Data });
            
  
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
        this.setState({ orderInEdit: this.cloneOrder(dataItem) });
    }

    OrderLines = (dataItem ) => {
        this.setState({ orderInDelete: this.cloneOrder(dataItem) });
        
    }

    delete = () => {
        const dataItem = this.state.orderInDelete;
        const orders = this.state.Order.slice();
        const index = orders.findIndex(p => p.Id === dataItem.Id);
        const itemId =  dataItem.Id;
        if (index !== -1) {
            orders.splice(index, 1);
            Axios.delete('http://localhost:64883/api/Order/Delete', { params: { id: itemId } })
            .then(response => {
                console.log(response);
            }).catch(error => {
                console.log(error);
              });
            this.setState({
                Order: orders,
                orderInDelete: undefined
            });
        }
    }
    
    save = () => {
        const dataItem = this.state.orderInEdit;
        const orders = this.state.Order.slice();
        const itemId =  dataItem.Id;
        if (dataItem.OrderID === undefined) {
            orders.unshift(this.newOrder(dataItem));
        } else {
            const index = orders.findIndex(p => p.OrderID === dataItem.OrderID);
            orders.splice(index, 1, dataItem);
        }
        Axios({
            method: 'POST',
            url:'http://localhost:64883/api/Order/Update',
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
            Order: orders,
            orderInEdit: undefined
        });
        
    }

    cancel = () => {
        this.setState({ orderInEdit: undefined });
        this.setState({ orderInDelete: false });
    }

    insert = () => {
        this.setState({ orderInEdit: { } });
    }


    render() {

        return (
            <div className = {classes.OrderGrid}>
             <h2 className= {classes.Heading}>Orders</h2>
             
                <Grid
                    style={{ height: '420px' }}
                    // filterable={true}
                        sortable={true}
                        pageable={{ pageSizes: true }}
                        {...this.props}
                    data={this.state.Order.slice(this.state.skip, this.state.take + this.state.skip)}
                  detail={DetailComponent}
                    expandField="expanded"
                    onExpandChange={this.expandChange}
                    skip={this.state.skip}
                    take={this.state.take}
                    total={this.state.Order.length}
                    
                    onPageChange={this.pageChange}
                    
                >
                 <GridToolbar>
                    <div onClick={this.closeEdit}>
                        <button title="Add new" className="k-button k-primary"  >
                        { <Link  to="/addorder" >Add New</Link>}
                    </button>
                    </div>
                </GridToolbar >
                    <Column field="Id" title="ID" width="50px" />
                    <Column field="Customer.FirstName" title="Customer Name"  />
                    <Column field="IsConfirmed"
                        cell={(props) => (
                            <td>
                                <input disabled type="checkbox" checked={props.dataItem[props.field]} />
                            </td>
                        )} />
                        <Column field="OrderDate" title="Order Date"  />
                         <Column
                        title="Edit"
                        cell={cellWithEditing(this.edit, this.OrderLines)}
                    />
                </Grid>
                {this.state.orderInEdit && <DialogContainer dataItem={this.state.orderInEdit} save={this.save} cancel={this.cancel}/>}
                {this.state.orderInDelete && <RemoveDialog dataItem={this.state.orderInDelete} delete={this.delete} cancel={this.cancel}/> }
            </div>
        );
    }
    dialogTitle() {
        return `${this.state.orderInEdit.OrderID === undefined ? 'Add' : 'Edit'} order`;
    }
    cloneOrder(order) {
        return Object.assign({}, order);
    }
    newOrder(source) {
        const newOrder = {
            Id: this.generateId(),
            FirstName: '',
            IsConfirmed: false,
     };

        return Object.assign(newOrder, source);
    }

    generateId() {
        let id = 1;
        this.state.Order.forEach(p => { id = Math.max((p.Id || 0) + 1, id); });
        return id;
    }
}


export default OrderGrid;