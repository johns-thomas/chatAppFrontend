import React ,{Component} from 'react';
import Aux from '../../hoc/Aux';
import classes from './Layout.css';
import Toolbar from '../navigation/toolbar/Toolbar';
import SideDrawer from '../navigation/SideDrawer/SideDrawer'

import {connect } from 'react-redux';

class Layout extends Component {
    state={
        showSideDrawer:false
    }
    sideDrawerHandler=()=>{
        this.setState({showSideDrawer:false})
    }
    toggleSideDrawer=()=>{
        this.setState((prevState)=>{
            return {showSideDrawer:!prevState.showSideDrawer}
        })
    }
    render(){
    return (
        <Aux>
            <Toolbar islogin={this.props.isLogin} clicked={this.toggleSideDrawer}/> 
            <SideDrawer show={this.state.showSideDrawer} clicked={this.sideDrawerHandler}/>
                <div >Toolbar SideBar builder</div>
                <main className={classes.content}>
                    {this.props.children}
                </main>
            
         
        </Aux>
    );
    };
};

const mapsStatetoProp=state=>{
    return{
        isLogin:state.token!=null
    }

}
export default connect(mapsStatetoProp)(Layout);