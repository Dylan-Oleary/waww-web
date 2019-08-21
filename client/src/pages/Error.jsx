import React, { useEffect, useState } from 'react';
import { A } from 'hookrouter';

import Logo from '../public/assets/images/error-ticket.svg';

const Error = ({ type }) => {
    const [message, setMessage] = useState('hey')

    useEffect(() => {
        if(type === "authError"){
            setMessage("It looks like you're lost! This area is only for members!")
        } else if(type === "notFound"){
            setMessage("The page you are looking for does not exist!")
        }
    },[])

    return (
        <div id="Error">
            <div className="image-container">
                <img src={Logo} required />
            </div>
            <div className="error-message">
                <h2>{message}</h2>
            </div>
            <div className="error-footnote">
                <div>
                    <span>Already have an account? <A href="/login">Click here to login</A></span>
                </div>
                <div>
                    <span>Don't have an account? <A href="/register">Click here to register</A> or <A href="/">Click here to go back home</A></span>
                </div>
            </div>
        </div>
    )
}

export default Error;