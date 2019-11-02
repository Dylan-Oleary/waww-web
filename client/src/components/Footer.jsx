import React from 'react';
import { Link } from "react-router-dom";

import Logo from '../public/assets/images/ticket-logo.png';

const Footer = () => {
    return (
        <div id="Footer" className="ui fluid container">
            <div className="ui container centered grid">
                <div className="row">
                    <div className="ui six wide column center aligned">
                        <div className="ui list">
                            <h2>Project Info</h2>
                            <Link to="/about"> About </Link>
                            <Link to="/contact"> Contact </Link>
                            <a href="https://www.themoviedb.org/?language=en-US" target="_blank"> TMDB </a>
                            <a href="https://www.themoviedb.org/documentation/api" target="_blank"> API </a>
                        </div>
                    </div>
                    <div className="ui four wide column center aligned image-container">
                        <img className="ui fluid image" src={Logo} />
                    </div>
                    <div className="ui six wide column center aligned">
                        <div className="ui list">
                            <h2>Personal</h2>
                            <a href="https://github.com/Dylan-Oleary" target="_blank">GitHub</a>
                            <a href="https://github.com/Dylan-Oleary/waww-web" target="_blank">Project Repository</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;