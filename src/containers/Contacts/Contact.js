import React ,{Component} from 'react';
import  classes from "../Messages/Messages.css";
import Aux from '../../hoc/Aux';
import ContactPerson from './ContactPerson'
import { connect } from 'react-redux';
import Input from '../../components/AuthInput/Input';
//import * as actions from '../../store/action/auth'
import Messages from '../Messages/Messages'
import Spinner from '../../components/UI/Spinner/Spinner'

class Contact extends Component{

    state={
        controls:{
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Name'
                },
            value: '',
            validation: {
                    required: true,
                   
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
                }
                
                
            },formShow:false,
            formIsValid:false,
            contacts:null,
            init:false,
            receiver:null,
            spin:true,
            recname:null,
            err:null,
            open:false
        }

        componentDidMount(){
           //console.log(this.props.token);
        
          fetch("http://localhost:8080/get-contacts",{
                headers:{ 
                    'Content-Type': 'application/json',
                   
                    Authorization: "BearerContact " + localStorage.getItem('token')
                },
                method:'POST'
            }
            ).then((result)=>{
                  
                  //implement error handling
                  return result.json();
              }).then((res) =>{
                  const con=[...res.contacts]
                  
                  this.setState({spin:false,contacts:con});
              }).catch((err)=>{
                  console.log(err);
              });
              
         }

  


        checkValidity(value, rules) {
            let isValid = true;
            if (!rules) {
                return true;
            }
            
            if (rules.required) {
                isValid = value.trim() !== '' && isValid;
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
            this.setState({controls: updatedControls,formIsValid:true});
        }
    buttonHandler=(event)=>{
        event.preventDefault();
        let show=this.state.formShow;
        this.setState({formShow:!show})

    }

    submitHandler=(event)=>{
        event.preventDefault();
        console.log(this.state.controls.name.value)
        const data ={
            contactName:this.state.controls.name.value,
            contactMail:this.state.controls.email.value
        }
        fetch("http://localhost:8080/add-contact",{
            method:"POST",
            body:JSON.stringify({
                data:data
            }),
            headers:{ 
                'Content-Type': 'application/json',
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        }).then(res=>{       
        return res.json();
    }).then((res)=>{
        console.log(res)
        if(+res.status===500 || +res.status===401){
          
            const name={...this.state.controls.name,value:'',valid:false,touched:false}
            const email={...this.state.controls.email,value:'',valid:false,touched:false}
            const newControls ={
                name:name,email:email
            }
            this.setState({err:"Creating contact failed",controls:newControls})
            
        }
       
        else{
            const newContact=[...this.state.contacts];
            newContact.push(res.data)
    
            const name={...this.state.controls.name,value:'',valid:false,touched:false}
            const email={...this.state.controls.email,value:'',valid:false,touched:false}
            const newControls ={
                name:name,email:email
            }
            this.setState({controls:newControls,contacts:newContact,formShow:false});
        }
        
    }).catch((err)=>{
        console.log(err);
        this.setState({err:err})
    });
    }



    // contactcliked!
    contactClicked=(contactId,contactname)=>{
        this.setState({init:true,receiver:contactId,recname:contactname})
        //console.log(contactId)
       //this.props.oncontact(contactId);
    }
    render (){
        let loader=null;
        if(this.state.spin){
            loader=<Spinner/>;
        }
        let showForm=null;
        let form=null;
         let newContact;
         if(this.state.contacts){

            newContact=this.state.contacts.map((contact) =>{
                if(!contact){
                    return null;
                }
            
                return (<ContactPerson styles={classes.box} click={()=>this.contactClicked(contact._id,contact.name)} key={contact._id} disabled={this.state.init}>
                  
                        {contact.name}
                
                </ContactPerson>)
            });
         } 
        
        const formElementsArray = [];
        if(this.state.formShow){  
            for ( let key in this.state.controls ) {
           
            formElementsArray.push( {
                id: key,
                config: this.state.controls[key]
            } );
        }
        form = formElementsArray.map( formElement => (
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
       
       showForm=(<form onSubmit={this.submitHandler}>
        {form}
        <button className={classes.button} disabled={!this.state.formIsValid}><span>SUBMIT</span></button>
    </form>) ;
    
    
    
       }
      
      let messages=null;
       if(this.state.init){
           
           messages=<Messages receiver={this.state.receiver} name={this.state.recname} open={this.state.open} />
       }
      
       let error=null;
       if(this.state.err){
           error=<div style={{padding:'10px'} }>{this.state.err}</div>
       }
       
       /*let element= (
       <div className={style}>


       {newContact}
       
       <div className={classes.formelement}>
       <button className={classes.fbutton} onClick={this.buttonHandler}> Add Contact</button>
       {showForm}
       
       </div>
       </div>)
       if (window.matchMedia('only screen and (max-width: 500px)').matches) {
        console.log('under 320 pixels');    
            
    } */
        return(
            <Aux>
                <div className={classes.container}>
                   
                    <div className={classes.contact}>
                    <div ><strong  className={classes.chead}>Contacts</strong></div>
            
                    {newContact}
                    
                    <div className={classes.formelement}>
                    <button className={classes.fbutton} onClick={this.buttonHandler}> Add Contact</button>
                    {showForm}
                    
                    </div>
                    </div>
                    {loader}
                    {messages}
                    {error}
            </div>
            </Aux>
        );
    }



};
const mapsStatetoProp=state=>{

    return{
        token:state.token
    };

};
//const mapsDispatchtoProps=dispatch=>{
  //  return {
      //  oncontact:(reciever)=>dispatch(actions.contact(reciever))
 //   }
//};
export default connect(mapsStatetoProp)(Contact);