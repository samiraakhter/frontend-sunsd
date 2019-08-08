import React, { Component } from 'react';
import { Grid, GridColumn as Column, GridDetailRow } from '@progress/kendo-react-grid';
 import "@progress/kendo-theme-default/dist/all.css"


import Axios from 'axios';

class DetailComponent extends GridDetailRow {
    render() {
        const dataItem = this.props.dataItem;
        const url = 'http://localhost:64883';
        return (
            <section>
                <p><strong>Fullfilled:</strong> {dataItem.Fullfilled ? "Yes" : 'No'} </p>
                <p><strong>Is Active:</strong> {dataItem.IsActive ? "Yes" : 'No'} </p>
                <p><strong>OnHand:</strong> {dataItem.OnHand ? "Yes" : 'No'} </p>
                <p><strong>Sku:</strong> {dataItem.Sku}</p>
                <p><strong>Product Category:</strong> {dataItem.ProductCategory.ProductCategoryName}</p>
                <p><strong>Product Type:</strong> {dataItem.ProductType.ProductTypeName}</p>
                <img alt="loading..." src={url+dataItem.ProductImage} width={100} height={100}/>

            </section>
        );
    }
}

class GetProduct extends Component {
    state = {
        
        Product: [],
        skip: 0, 
        take: 10,
        productInEdit: undefined,
        productInDelete: false,
        isloaded: false
    }
    componentDidMount() {
        Axios.get('http://localhost:64883/api/Product')
        .then((response) => {
            
            return response.data;
            
        })
        .then(data => {
              
            
            this.setState({  Product: data.Data });
            
  
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
        this.setState({ productInEdit: this.cloneProduct(dataItem) });
    }

    remove = (dataItem ) => {
        this.setState({ productInDelete: this.cloneProduct(dataItem) });
        
    }

    delete = () => {
        const dataItem = this.state.productInDelete;
        const products = this.state.Product.slice();
        const index = products.findIndex(p => p.Id === dataItem.Id);
        const itemId =  dataItem.Id;
        if (index !== -1) {
            products.splice(index, 1);
            Axios.delete('http://localhost:64883/api/Product/Delete', { params: { id: itemId } })
            .then(response => {
                console.log(response);
            }).catch(error => {
                console.log(error);
              });
            this.setState({
                Product: products,
                productInDelete: undefined
            });
        }
    }
    
    save = () => {
        const dataItem = this.state.productInEdit;
        const products = this.state.Product.slice();
        const itemId =  dataItem.Id;
        if (dataItem.ProductID === undefined) {
            products.unshift(this.newProduct(dataItem));
        } else {
            const index = products.findIndex(p => p.ProductID === dataItem.ProductID);
            products.splice(index, 1, dataItem);
        }
        Axios({
            method: 'POST',
            url:'http://localhost:64883/api/Product/Update',
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
            Product: products,
            productInEdit: undefined
        });
        
    }

    cancel = () => {
        this.setState({ productInEdit: undefined });
        this.setState({ productInDelete: false });
    }

    insert = () => {
        this.setState({ productInEdit: { } });
    }


    render() {

        return (
            <div>
             
                <Grid
                   
                     data={this.state.Product}
                    detail={DetailComponent}
                    expandField="expanded"
                    onExpandChange={this.expandChange}
                    
                >
                
                    <Column field="Id" title="ID" width="50px" />
                    <Column field="ProductName" title="Name"  />
                    <Column field="Instock"
                        cell={(props) => (
                            <td>
                                <input disabled type="checkbox" checked={props.dataItem[props.field]} />
                            </td>
                        )} />
                        <Column field="Variants" title="Variant"  />
                        
                </Grid>
            </div>
        );
    }
    cloneProduct(product) {
        return Object.assign({}, product);
    }
    newProduct(source) {
        const newProduct = {
            Id: this.generateId(),
            ProductName: '',
            Instock: false,
            Discontinued: false
        };

        return Object.assign(newProduct, source);
    }

    generateId() {
        let id = 1;
        this.state.Product.forEach(p => { id = Math.max((p.Id || 0) + 1, id); });
        return id;
    }
}


export default GetProduct;