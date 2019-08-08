import React, { Component } from 'react';
import { Grid, GridColumn as Column, GridToolbar, GridDetailRow } from '@progress/kendo-react-grid';
import { Link } from 'react-router-dom';
 import "@progress/kendo-theme-default/dist/all.css"


import classes from './GetInventory.css';
import cellWithEditing from './EditingCell';
import DialogContainer from './DialogContainer.jsx';
import RemoveDialog from './RemoveDialog.jsx';
import Axios from 'axios';

class DetailComponent extends GridDetailRow {
    render() {
        const dataItem = this.props.dataItem;
        return (
            <section>
                <p><strong>Is Active:</strong> {dataItem.IsActive ? "Yes" : 'No'} </p>
                <p><strong>Reorder Quantity:</strong> {dataItem.ReorderQuantity ? "Yes" : 'No'} </p>
                <p><strong>Minimum Stock Level:</strong> {dataItem.MinimumStockLevel}</p>
            </section>
        );
    }
}

class GetInventory extends Component {
    state = {
        
        Inventory: [],
        skip: 0, 
        take: 10,
        itemInEdit: undefined,
        itemInDelete: false,
        isloaded: false
    }
    componentDidMount() {
        Axios.get('http://localhost:64883/api/Inventory')
        .then((response) => {
            
            return response.data;
            
        })
        .then(data => {
              
            
            this.setState({  Inventory: data.Data });
            
  
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
        this.setState({ itemInEdit: this.cloneInventory(dataItem) });
    }

    remove = (dataItem ) => {
        this.setState({ itemInDelete: this.cloneInventory(dataItem) });
        
    }

    delete = () => {
        const dataItem = this.state.itemInDelete;
        const inventories = this.state.Inventory.slice();
        const index = inventories.findIndex(p => p.Id === dataItem.Id);
        const itemId =  dataItem.Id;
        if (index !== -1) {
            inventories.splice(index, 1);
            Axios.delete('http://localhost:64883/api/Inventory/Delete', { params: { id: itemId } })
            .then(response => {
                console.log(response);
            }).catch(error => {
                console.log(error);
              });
            this.setState({
                Inventory: inventories,
                itemInDelete: undefined
            });
        }
    }
    
    save = () => {
        const dataItem = this.state.itemInEdit;
        const inventories = this.state.Inventory.slice();
        const itemId =  dataItem.Id;
        if (dataItem.Id === undefined) {
            inventories.unshift(this.newInventory(dataItem));
        } else {
            const index = inventories.findIndex(p => p.Id === dataItem.Id);
            inventories.splice(index, 1, dataItem);
            console.log(dataItem);
        }
        Axios({
            method: 'POST',
            url:'http://localhost:64883/api/Inventory/Update',
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
            Inventory: inventories,
            itemInEdit: undefined
        });
        
    }

    cancel = () => {
        this.setState({ itemInEdit: undefined });
        this.setState({ itemInDelete: false });
    }

    insert = () => {
        this.setState({ itemInEdit: { } });
    }


    render() {

        return (
            <div className = {classes.Inventory}>
             <h2 className= {classes.Heading}>INVENTORY ITEMS</h2>
             
                <Grid
                    style={{ height: '420px' }}
                    // filterable={true}
                        sortable={true}
                        pageable={{ pageSizes: true }}
                        {...this.props}
                    data={this.state.Inventory.slice(this.state.skip, this.state.take + this.state.skip)}
                detail={DetailComponent}
                    expandField="expanded"
                    onExpandChange={this.expandChange}
                    skip={this.state.skip}
                    take={this.state.take}
                    total={this.state.Inventory.length}
                    
                    onPageChange={this.pageChange}
                    
                >
                 <GridToolbar>
                    <div onClick={this.closeEdit}>
                        <button title="Add new" className="k-button k-primary"  >
                        { <Link  to="/additem" >Add New</Link>}
                    </button>
                    </div>
                </GridToolbar >
                    <Column field="Id" title="ID" width="50px" />
                    <Column field="Product.ProductName" title="Name"  />
                    <Column field="Amount" title="Amount" />
                        <Column field="Unit" title="Unit"  />
                        <Column field="DefaultLocation" title="Default Location"  />
                         <Column
                        title="Edit"
                        cell={cellWithEditing(this.edit, this.remove)}
                    />
                </Grid>
                {this.state.itemInEdit && <DialogContainer dataItem={this.state.itemInEdit} save={this.save} cancel={this.cancel}/>}
                {this.state.itemInDelete && <RemoveDialog dataItem={this.state.itemInDelete} delete={this.delete} cancel={this.cancel}/> }
            </div>
        );
    }
    dialogTitle() {
        return `${this.state.itemInEdit.Id === undefined ? 'Add' : 'Edit'} inventory`;
    }
    cloneInventory(inventory) {
        return Object.assign({}, inventory);
    }
    newInventory(source) {
        const newInventory = {
            Id: this.generateId(),
            Product: '',
            Amount: '',
            Unit: '',
            DefaultLocation: ''
        };

        return Object.assign(newInventory, source);
    }

    generateId() {
        let id = 1;
        this.state.Inventory.forEach(p => { id = Math.max((p.Id || 0) + 1, id); });
        return id;
    }
}


export default GetInventory;