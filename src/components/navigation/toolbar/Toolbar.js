import React from 'react'; 
import classes from './Toolbar.css';
import Logo from '../../../assets/logo/logo'
import NavItems from '../navigationItems/navigationItems'
import DrawToggler from "../SideDrawer/Drawtoggler/DrawToggler";
const toolbar = (props)=>(
    <div className ={classes.Toolbar}>
       <DrawToggler clicked={props.clicked}/>
       <Logo/>
       
       <nav className={classes.DesktopOnly}> <NavItems islogin={props.islogin}/></nav>
       
    </div>
);
export default toolbar;