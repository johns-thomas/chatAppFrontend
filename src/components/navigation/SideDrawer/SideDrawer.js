import React from 'react';
import Logo from '../../../assets/logo/logo';
import NavItems from '../navigationItems/navigationItems'
import classes from './SideDrawer.css'
import Backdrop from '../../UI/Backdrop/Backdrop'
import Aux from '../../../hoc/Auxi'
const sideDrawer =(props) =>{
    const h='11%';
    let attachedClasses=[classes.SideDrawer,classes.Close];
    if(props.show){
        attachedClasses=[classes.SideDrawer,classes.Open];
    }
    return(
        <Aux>
            <Backdrop show={props.show} clicked={props.clicked}/>
        <div className={attachedClasses.join(' ')}>
            <div style={{height:h}}>
            <Logo/>
            </div>
            
            <nav>
                <NavItems/>
            </nav>



        </div>
        </Aux>
    );
}
export default sideDrawer;