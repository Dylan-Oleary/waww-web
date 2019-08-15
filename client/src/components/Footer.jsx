import React from 'react';
import { A } from 'hookrouter';

import Logo from '../public/assets/images/ticket-logo.png';

const Footer = () => {
    return (
        <div id="Footer" className="ui fluid container">
            <div className="ui container centered grid">
                <div className="row">
                    <div className="ui six wide column center aligned">
                        <div className="ui list">
                            <h2>Project Info</h2>
                            <A href="/about"> About </A>
                            <A href="/contact"> Contact </A>
                            <A href="/tmdb"> TMDB </A>
                            <A href="/tmdb-api"> API </A>
                        </div>
                    </div>
                    <div className="ui four wide column center aligned image-container">
                        <img className="ui fluid image" src={Logo} />
                    </div>
                    <div className="ui six wide column center aligned">
                        <div className="ui list">
                            <h2>Personal</h2>
                            <A href="/github">GitHub</A>
                            <A href="/github-repo">Project Repository</A>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;