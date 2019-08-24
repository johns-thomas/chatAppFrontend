import React,{Component} from "react";
import  classes from "./Messages.css";
import Message from './Message/Message'
import Aux from '../../hoc/Auxi';
import { connect } from 'react-redux';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner'
import socketIOClient from "socket.io-client";

class Messages extends Component{
 
    messagesEnd=React.createRef();
    state={
   
    message:[],
    sendMesages:[],
    chatForm:{
        elementType:'input',
        elementConfig:{
            type:'text',
            placeholder:"Type Message"
        },
        value:"",
        


    },
    isSend:true,
        
        prev_receiver:this.props.receiver,
        spin:true,
        name:null
    }
   
    componentDidMount(){

        fetch("http://localhost:8080/messages",{
            
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "BearerMount " + localStorage.getItem('token')
              },
            body:JSON.stringify({
               
                receiver:this.props.receiver
            })
    }
        ).then((result)=>{
              
              //implement error handling
              return result.json();
          }).then((res) =>{
              //console.log(res.message);
//console.log("props" +this.props.receiver)
              this.setState({message:res.message,prev_receiver :this.props.receiver,spin:false,name:this.props.name});
             
            }).catch((err)=>{
              console.log(err);
          });
          this.scrollToBottom();

          
        // this.setState({prev_receiver :this.props.receiver,spin:false})
        let socket=socketIOClient.connect("http://localhost:8080");
        socket.on('connect',()=> {
            // Connected, let's sign-up for to receive messages for this room
            socket.emit('room', localStorage.getItem('id'));
            //console.log("SENDfeqf")
           
         
       
    });
    socket.on('message',data=>{
       console.log(data) 
      this.addMessage(data)

    });
    
    };
    addMessage=data=>{
        this.setState(prevState => {
            const updatedPosts = [...prevState.message];
         
           updatedPosts.push(data)
            return {
              message:updatedPosts
            };
          });
    }






    componentDidUpdate(){
        if(this.state.prev_receiver!==this.props.receiver){
            if(localStorage.getItem('token')){
                fetch("http://localhost:8080/messages",{
            
                    headers:{ 
                        'Content-Type': 'application/json',
                       
                        Authorization: "BearerUpdate " + localStorage.getItem('token')
                    },
                    method:'POST',
                body:JSON.stringify({
                   
                    receiver:this.props.receiver
                })
        }
            ).then((result)=>{
                  
                  //implement error handling
                  return result.json();
              }).then((res) =>{
                  ///console.log(res.message);
                 // console.log("props" +this.props.receiver)
                  this.setState({message:res.message,prev_receiver :this.props.receiver,name:this.props.name});
              }).catch((err)=>{
                  console.log(err);
              });
            }
            
        }
        this.scrollToBottom();
      };
    


    textHandler=(event)=>{
       // console.log(event.target.value);
        const newState ={
            ...this.state.chatForm,value:event.target.value
        }
        this.setState({chatForm:newState});
    }

    

    sendHandler=(event)=>{
        event.preventDefault();
        
        const content=this.state.chatForm.value;
        //console.log(content);
        if(!content){
            return
        }
        fetch("http://localhost:8080/me",{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer "+ localStorage.getItem('token') //this.props.token
              },
            body:JSON.stringify({
                content:content,
                receiver:this.props.receiver
            })
        }).then((res)=>{
           console.log(res);
            if(+res.status===201){
                console.log("Success")
            }
            return res.json()
        }).then((res)=>{
            const stateMessage=[...this.state.message];
            stateMessage.push(res.post)
           
            //stateMessage.push(newMessage);
            const newChat ={
                ...this.state.chatForm,value:""
            }
            this.setState({chatForm:newChat,message:stateMessage});
        }).catch((err)=>{
            console.log(err);
        });

    }
    scrollToBottom ()  {
        this.messagesEnd.scrollIntoView();
        console.log(this.messagesEnd)
      }



    deleteMessageHandler=(id)=>{
        //http delete request
        const auxMessage=this.state.message;
        const delId=auxMessage.findIndex((mess)=>{
            return mess._id.toString() === id.toString();
        });
        auxMessage.splice(delId);
        //
    }
    close=()=>{
        this.setState({init:true})
    }
    render(){
        let loader=null;
        if(this.state.spin){
            loader=<Spinner/>;
        }
        let posts=null;
        if(this.state.message.length>0){
           posts=this.state.message.map((post) =>{
                //console.log(post);
                let align=0;
                
                if(post){
                    if(post.receiver===this.props.receiver){
                        align=1
                    }
                    return <Message  message={post.message} key={post._id} align={align} />
                }
               
            })
        }
       
        let form=this.state.chatForm;

        let style=classes.PostContainer;
       let button;
        if (window.matchMedia('only screen and (max-width: 500px)').matches) {
         console.log('under 320 pixels');    
         style= classes.PostContainersmall ;
         button=<button onClick={this.close}>close</button>
         if(this.state.init){
             style=classes.Close
         }              
     } 



      
        return(
            <Aux >
              
                
                   
                    
                    
                   
                    <div className={style} >
                    <div className={classes.namebar}>{button}{this.state.name}</div> 
                         <div  className={classes.Messages} >
                             {loader}
                             {posts}
                             <div ref={el=>{this.messagesEnd=el}}></div>
                        </div>
                        
                            <form onSubmit={(event) =>this.sendHandler(event)}>
                                <div className={classes.TextContainer} >
                                    <Input elementType={form.elementType} 
                                    elementConfig={form.elementConfig} value={form.value} 
                                 changed={this.textHandler}/>
                                  
                                  <div className={classes.Button} >
                                    <button ><strong>send</strong></button>
                                </div>
                                </div>
                            
                        </form>
                    
                    </div>
                   
          
           
                    
        
                 
            </Aux>
          
        );
    }


}
const mapsStatetoProp=state=>{
    return{
        token:state.token,
        receiver:state.receiver
    }

}
export default Messages;