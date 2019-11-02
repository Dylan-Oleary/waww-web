import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

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
                <img src={Logo} />
            </div>
            <div className="error-message">
                <h2>{message}</h2>
            </div>
            <div className="error-footnote">
                <div>
                    <span>Already have an account? <Link to="/login">Click here to login</Link></span>
                </div>
                <div>
                    <span>Don't have an account? <Link to="/register">Click here to register</Link> or <Link to="/">Click here to go back home</Link></span>
                </div>
            </div>
        </div>
    )
}

export default Error;