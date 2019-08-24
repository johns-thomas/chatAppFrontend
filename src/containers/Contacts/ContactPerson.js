import React from 'react';



const contact = (props) => (
    <div onClick={props.click} className={props.styles}><strong>{props.children}</strong></div>
);

export default contact;