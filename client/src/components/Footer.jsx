import React from 'react';
import { Link } from "react-router-dom";
import { Container, Grid, Image, List } from "semantic-ui-react";

import Logo from '../public/assets/images/ticket-logo.png';

const Footer = () => {
    return (
        <Container id="Footer" fluid={true}>
            <Grid columns="equal" stackable={true}>
                <Grid.Row className="lifted">
                    <Grid.Column textAlign={"center"}>
                        <List>
                            <List.Item content={<h2 className="heading small shadow">Project Info</h2>} />
                            <List.Item content={<Link to="/about"> About </Link>} />
                            <List.Item content={<Link to="/contact"> Contact </Link>} />
                            <List.Item content={<a href="https://www.themoviedb.org/?language=en-US" target="_blank"> TMDB </a>} />
                            <List.Item content={<a href="https://www.themoviedb.org/documentation/api" target="_blank"> API </a>} />
                        </List>
                    </Grid.Column>
                    <Grid.Column className="mobile none">
                        <Image className="footer-logo" src={Logo} />
                    </Grid.Column>
                    <Grid.Column textAlign={"center"}>
                        <List>
                            <List.Item content={<h2 className="heading small shadow">Personal</h2>} />
                            <List.Item content={<a href="https://github.com/Dylan-Oleary" target="_blank">GitHub</a>} />
                            <List.Item content={<a href="https://github.com/Dylan-Oleary/waww-web" target="_blank">Project Repository</a>} />
                        </List>
                    </Grid.Column>
                </Grid.Row>
                <div className="mobile-only">
                    <Image className="mobile-logo" src={Logo} fluid/>
                </div>
            </Grid>
        </Container>
    );
}

export default Footer;