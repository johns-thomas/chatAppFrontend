import React, { Component } from 'react';
import { connect } from 'react-redux';

import Input from '../../components/AuthInput/Input';
import {Redirect} from 'react-router-dom';
import classes from './Auth.css';
import * as actions from '../../store/action/auth';

class Auth extends Component {
    state = {
        controls: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'name',
                    placeholder: 'Your name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }, confirmPassword: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Confirm Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
         
        },
        formIsValid:false
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }

    inputChangedHandler = (event, controlName) => {
     
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        };
        
        let formIsValid = true;
        for (let inputIdentifier in updatedControls) {
            formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
        }
        this.setState({controls:updatedControls, formIsValid: formIsValid});
    }

//
    submitHandler=(event)=>{
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value,
            this.state.controls.password.value,this.state.controls.name.value,
            this.state.controls.confirmPassword.value,this.props.match);
    }


    render () {
        const formElementsArray = [];
        for ( let key in this.state.controls ) {
       
            formElementsArray.push( {
                id: key,
                config: this.state.controls[key]
            } );
        }
 
        const form = formElementsArray.map( formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={( event ) => this.inputChangedHandler( event, formElement.id )} />
        ) );
       let redirect=null;
        if(this.props.isLogined){
           redirect= <Redirect to='/' />
        }
       
        return (
            <div className={classes.Auth}>
                {redirect}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <button className={classes.button} disabled={!this.state.formIsValid}><span>Sign in</span></button>
                </form>
        
            </div>
           
        );
    }
}

const mapsStatetoProp=state=>{
    return{
        isLogined:state.token
    }

}
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password,name,confirmPassword) => dispatch(actions.auth(email, password,name,confirmPassword))
    };
}
export default connect(mapsStatetoProp,mapDispatchToProps)(Auth);