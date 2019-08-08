import React, { Component } from 'react';
import { Grid, GridColumn as Column, GridToolbar, GridDetailRow } from '@progress/kendo-react-grid';
import { Link } from 'react-router-dom';
 import "@progress/kendo-theme-default/dist/all.css"


import classes from './GetRoute.css';
import cellWithEditing from './EditingCell';
import DialogContainer from './DialogContainer.jsx';
import RemoveDialog from './RemoveDialog.jsx';
import Axios from 'axios';

class DetailComponent extends GridDetailRow {
    render() {
        const dataItem = this.props.dataItem;
        return (
            <section>
                <p><strong>IsRepeatable:</strong> {dataItem.isRepeatable ? "Yes" : 'No'} </p>
                <p><strong>SalesPerson:</strong> {dataItem.GetSalesPerson.Username}</p>

            </section>
        );
    }
}

class GetRoute extends Component {
    state = {
        
        Route: [],
        skip: 0, 
        take: 10,
        routeInEdit: undefined,
        routeInDelete: false
    }
    componentDidMount() {
        Axios.get('http://localhost:64883/api/Route')
        .then((response) => {
            
            return response.data;
          
            
        })
        .then(data => {
              
            
            this.setState({  Route: data.Data });
            console.log(this.state.Route);
  
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
        this.setState({ routeInEdit: this.cloneRoute(dataItem) });
    }

    remove = (dataItem ) => {
        this.setState({ routeInDelete: this.cloneRoute(dataItem) });
        
    }

    delete = () => {
        const dataItem = this.state.routeInDelete;
        const routes = this.state.Route.slice();
        const index = routes.findIndex(p => p.Id === dataItem.Id);
        const itemId =  dataItem.Id;
        if (index !== -1) {
            routes.splice(index, 1);
            Axios.delete('http://localhost:64883/api/Route/Delete', { params: { id: itemId } })
            .then(response => {
                console.log(response);
            }).catch(error => {
                console.log(error);
              });
            this.setState({
                Route: routes,
                routeInDelete: undefined
            });
        }
    }
    
    save = () => {
        const dataItem = this.state.routeInEdit;
        const routes = this.state.Route.slice();
        const itemId =  dataItem.Id;
        if (dataItem.RouteID === undefined) {
            routes.unshift(this.newRoute(dataItem));
        } else {
            const index = routes.findIndex(p => p.RouteID === dataItem.RouteID);
            routes.splice(index, 1, dataItem);
        }
        Axios({
            method: 'POST',
            url:'http://localhost:64883/api/Route/Update',
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
            Route: routes,
            routeInEdit: undefined
        });
        
    }

    cancel = () => {
        this.setState({ routeInEdit: undefined });
        this.setState({ routeInDelete: false });
    }

    insert = () => {
        this.setState({ routeInEdit: { } });
    }


    render() {
        return (
            <div className = {classes.Route}>
             <h2 className= {classes.Heading}>ROUTES</h2>
             
                <Grid
                    style={{ height: '420px' }}
                    // filterable={true}
                        sortable={true}
                        pageable={{ pageSizes: true }}
                        {...this.props}
                    data={this.state.Route.slice(this.state.skip, this.state.take + this.state.skip)}
                    detail={DetailComponent}
                    expandField="expanded"
                    onExpandChange={this.expandChange}
                    skip={this.state.skip}
                    take={this.state.take}
                    total={this.state.Route.length}
                    
                    onPageChange={this.pageChange}
                    
                >
                 <GridToolbar>
                    <div onClick={this.closeEdit}>
                        <button title="Add new" className="k-button k-primary"  >
                        { <Link  to="/addroute" >Add New</Link>}
                    </button>
                    </div>
                </GridToolbar >
                    <Column field="Id" title="ID" width="50px" />
                    <Column field="RouteName" title="Name"  />
                    <Column field="isActive"
                        cell={(props) => (
                            <td>
                                <input disabled type="checkbox" checked={props.dataItem[props.field]} />
                            </td>
                        )} />
                        <Column format="{0:dd-MMM-yyyy }"  field="DateOfVisit" title="Date Of Visit" 
                                template= "#= kendo.toString(kendo.parseDate(DateOfVisit, 'yyyy-MM-dd'), 'MM/dd/yyyy') #"   />
                         <Column
                        title="Edit"
                        cell={cellWithEditing(this.edit, this.remove)}
                    />
                </Grid>
                {this.state.routeInEdit && <DialogContainer dataItem={this.state.routeInEdit} save={this.save} cancel={this.cancel}/>}
                {this.state.routeInDelete && <RemoveDialog dataItem={this.state.routeInDelete} delete={this.delete} cancel={this.cancel}/> }
            </div>
        );
    }
    dialogTitle() {
        return `${this.state.routeInEdit.RouteID === undefined ? 'Add' : 'Edit'} route`;
    }
    cloneRoute(route) {
        return Object.assign({}, route);
    }
    newRoute(source) {
        const newRoute = {
            Id: this.generateId(),
            RouteName: '',
            isActive: false,
            DateOfVisit: ''
        };

        return Object.assign(newRoute, source);
    }

    generateId() {
        let id = 1;
        this.state.Route.forEach(p => { id = Math.max((p.Id || 0) + 1, id); });
        return id;
    }
}


export default GetRoute;