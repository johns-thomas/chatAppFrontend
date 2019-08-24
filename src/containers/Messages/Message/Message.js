import React,{Component} from "react";
import classes from './Message.css';

class Message extends Component{

    render(){
        const style=[classes.Message]
        if(+this.props.align===1){
            style.push(classes.Send)
        }
        else{
            style.push(classes.Received)
        }
        
        return(
            <div className={style.join(' ')}>
                <p>{this.props.message}</p>
            </div>


        );
    }


}
export default Message;