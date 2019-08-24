import React from "react";
import classes from './input.css';
const input=(props)=>{
    return (
        <div className={classes.Input}>
            <input {...props.elementConfig} value={props.value} className={classes.InputElement} onChange={props.changed}/>
        </div>
    );
}
export default input;