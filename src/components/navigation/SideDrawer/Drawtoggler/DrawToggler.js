import React from 'react'
import classes from './DrawerToggle.css';
const drawToggler =(props)=>{
    return(
    <div onClick={props.clicked} className={classes.DrawerToggle}>
     
     <div></div>
     <div></div>
     <div></div>
    </div>
    );
}
export default drawToggler;