import React from 'react';

import Handshake from '../../assets/images/logo.png';
import classes from './Logo.css';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={Handshake} alt="MyLogo" />
    </div>
);

export default logo;