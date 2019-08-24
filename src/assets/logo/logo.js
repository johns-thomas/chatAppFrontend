import React from 'react';
import Logo from './svg.png';
import classes from './logo.css';
const logo =(props) =>(
    <div className={classes.Logo}>
        <img src= {Logo}  alt=""/>
    </div>

);
export default logo;