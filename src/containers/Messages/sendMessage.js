import React,{Component} from "react";
import Input from '../../components/UI/Input/Input';
import  classes from "./Messages.css";
class SendMessage extends Component{
    state={
        chatForm:{
            elementType:'input',
            elementConfig:{
                type:'text',
                placeholder:"Type Message"
            },
            value:""

        }
    }
    textHandler=(event)=>{
        console.log(event.target.value);
        const newState ={
            ...this.state.chatForm,value:event.target.value
        }
        this.setState({chatForm:newState});
    }

    

    sendHandler=(event)=>{
        event.preventDefault();
        const content=this.state.chatForm.value;
        console.log(content);
        fetch("http://localhost:8080/me",{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({
                content:content,
                receiver:"email"
            })
        }).then((res)=>{
            console.log(res);
            if(res.status==201){
                console.log("Success")
            }
            const newState ={
                ...this.state.chatForm,value:""
            }
            this.setState({chatForm:newState});
        }).catch((err)=>{
            console.log(err);
        });

    }
    render(){
        let form=this.state.chatForm;
        return(
            <form onSubmit={(event) =>this.sendHandler(event)}>
                <div className={classes.SendMessage}>
                    <Input elementType={form.elementType} 
                        elementConfig={form.elementConfig} value={form.value} 
                        changed={this.textHandler}/>
                    <button ><strong>send</strong></button>
                </div>
            
            </form>
        );
    }
}
export default SendMessage;