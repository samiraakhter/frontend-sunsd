import React, { Component } from 'react';


import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';

class Layout extends Component {
   

    render () {
        return (
            <div>
                <Toolbar/>
                
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </div>
        )
    }
}

export default Layout;