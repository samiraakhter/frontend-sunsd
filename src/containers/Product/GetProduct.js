import React, { Component } from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Link } from 'react-router-dom';
 import "@progress/kendo-theme-default/dist/all.css"


import classes from './GetProduct.css';
import cellWithEditing from './EditingCell';
import DialogContainer from './DialogContainer.jsx';
import Axios from 'axios';

class GetProduct extends Component {
    state = {
        
        Product: [],
        skip: 0, 
        take: 10,
        productInEdit: undefined
    }
    componentDidMount() {
        Axios.get('https://localhost:44331/api/Product')
        .then((response) => {
            console.log(response.data);
            return response.data;
            
        })
        .then(data => {
              
            
            this.setState({  Product: data.Data });
  
        }).catch(error => {
            console.log(error);
          });
    }
    pageChange = (event) => {
        this.setState({
            skip: event.page.skip,
            take: event.page.take
        });
    }
    
    edit = (dataItem) => {
        this.setState({ productInEdit: this.cloneProduct(dataItem) });
    }

    remove = (dataItem) => {
        const products = this.state.Product.slice();
        const index = products.findIndex(p => p.Id === dataItem.Id);
        const itemId =  dataItem.Id;
        if (index !== -1) {
            products.splice(index, 1);
            Axios.delete('https://localhost:44331/api/Product/Delete', { params: { id: itemId } })
            .then(response => {
                console.log(response);
            }).catch(error => {
                console.log(error);
              });
            this.setState({
                Product: products
            });
        }
    }

    save = () => {
        const dataItem = this.state.productInEdit;
        const products = this.state.products.slice();

        if (dataItem.ProductID === undefined) {
            products.unshift(this.newProduct(dataItem));
        } else {
            const index = products.findIndex(p => p.ProductID === dataItem.ProductID);
            products.splice(index, 1, dataItem);
        }

        this.setState({
            products: products,
            productInEdit: undefined
        });
    }

    cancel = () => {
        this.setState({ productInEdit: undefined });
    }

    insert = () => {
        this.setState({ productInEdit: { } });
    }


    render() {
        return (
            <div className = {classes.Product}>
             <h2 className= {classes.Heading}>PRODUCTS</h2>
             
                <Grid
                    style={{ height: '420px' }}
                    // filterable={true}
                        sortable={true}
                        pageable={{ pageSizes: true }}
                        {...this.props}
                    data={this.state.Product.slice(this.state.skip, this.state.take + this.state.skip)}
                    skip={this.state.skip}
                    take={this.state.take}
                    total={this.state.Product.length}
                    
                    onPageChange={this.pageChange}
                    
                >
                 <GridToolbar>
                    <div onClick={this.closeEdit}>
                        <button title="Add new" className="k-button k-primary" onClick={this.addRecord} >
                        { <Link  to="/addproduct" >Add New</Link>}
                    </button>
                    </div>
                </GridToolbar >
                    <Column field="Id" title="ID" width="50px" />
                    <Column field="ProductName" title="Name"  />
                    
                    <Column field="Instock"
                        cell={(props) => (
                            <td>
                                <input disabled type="checkbox" checked={props.dataItem[props.field]} />
                            </td>
                        )} />
                         <Column
                        title="Edit"
                        cell={cellWithEditing(this.edit, this.remove)}
                    />
                </Grid>
                {this.state.productInEdit && <DialogContainer dataItem={this.state.productInEdit} save={this.save} cancel={this.cancel}/>}
            </div>
        );
    }
    dialogTitle() {
        return `${this.state.productInEdit.ProductID === undefined ? 'Add' : 'Edit'} product`;
    }
    cloneProduct(product) {
        return Object.assign({}, product);
    }
}


export default GetProduct;