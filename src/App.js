import React, { Component } from 'react';
import Layout from './components/layouts/Layout'
import Contacts from './containers/Contacts/Contact';
import { Route, Switch ,withRouter,Redirect} from 'react-router-dom';

import Auth from './containers/Auth/Auth'
import Login from './containers/Auth/Login';
import Logout from './containers/Auth/Logout';
import { connect } from 'react-redux';
import * as actions from './store/action/auth';


class App extends Component {
  componentDidMount(){
    this.props.onMountCheck();
  }



  render() {
let code=null;
  if(this.props.isLogined){
   code=(<Switch>
          
   
         
    <Route exact path="/logout"  component={Logout} />
    <Route exact path="/"  component={Contacts} />
    <Redirect to="/" />
  </Switch>);
}
    else{
      code=(<Switch>
          
     
        <Route exact path="/signup"  component={Auth} />
       
        <Route exact path="/login"  component={Login} />
       <Redirect to="/login" />
       
      </Switch>);
    }



    return (
      
       <div>
        
        <Layout>
          {code}
          
          
        </Layout>
      </div>
     
     
    );
  }
}


const mapsStatetoProp=state=>{
  return{
      isLogined:state.token
  }

}
const mapDispatchToProps =(dispatch)=>{
  return{
    onMountCheck:()=>dispatch(actions.authCheckState())
  }
 
}
export default withRouter(connect( mapsStatetoProp,mapDispatchToProps)(App));
