
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, MenuItem } from '@progress/kendo-react-layout';

class MenuNavContainer extends React.Component {
    render() {
        return (
            <div>
                <Menu vertical={true} onSelect={this.onSelect}>
                <MenuItem text="Dashboard" data={{ route: '/' }} />
                    <MenuItem text="Create Users" data={{ route: '/register' }} />
                    <MenuItem text="Customer Routes" data={{ route: '/route' }}>
                    <MenuItem text="Add Route" data={{ route: '/addroute' }} />
                    </MenuItem>
                    <MenuItem text="Products" data={{ route: '/product' }} >
                    <MenuItem text="Create New Product" data={{ route: '/addproduct' }} />
                    </MenuItem>

                    <MenuItem text="Add Customer" data={{ route: '/addcustomer' }}>
                        <MenuItem text="Customers" data={{ route: '/customers' }} /> 
                    </MenuItem>
                    <MenuItem text="Inventory" data={{ route: '/inventory' }} >
                    <MenuItem text="Create New Inventory Item" data={{ route: '/additem' }} />
                    </MenuItem>
                    <MenuItem text="Customer Orders" data={{ route: '/orders' }} />
                </Menu>
                <div style={{ padding: 10 }}>{this.props.children}</div>
            </div>
        );
    }

    onSelect = (event) => {
        this.props.history.push(event.item.data.route);
    }
}

export default withRouter(MenuNavContainer);

