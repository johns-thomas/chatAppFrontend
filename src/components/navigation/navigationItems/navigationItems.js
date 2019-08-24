import React from 'react';
import NavItem from './navigationItem/navigationItem';
import classes from './navigationItem.css';

const navItems=(props) =>{
   

    if(props.islogin){
        return (
            <ul className={classes.NavItems}><NavItem link='./logout' exact>Logout</NavItem> </ul>
        )
    }else{
        return(   <ul className={classes.NavItems}>
       
            <NavItem link='./login' exact>Login</NavItem>
             <NavItem link="./signup">Sign Up</NavItem>
             
         </ul> )
    }
 
   

};




export default navItems;