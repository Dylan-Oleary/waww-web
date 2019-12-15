import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";

import BannerSlider from "../components/BannerSlider";
import MultiPanel from "../components/MultiPanel";
import { getHomePageContent } from '../redux/actions/movies';
import { getUserGenres } from '../redux/actions/pages';
import { setBrowserTitle } from "../utils/browserTitle";
import { shuffle } from "../utils/arrayHelpers";

const Home = ({ getUserGenres, getHomePageContent, homePage, login, user }) => {
    const { isLoading, hasError, classics, nowPlaying, popular, topRated, upcoming, userContent } = homePage;
    const history = useHistory();

    useEffect(() => {
        if(isLoading){
            setBrowserTitle(`WAWW | Home`);
            getHomePageContent();
        } else if(hasError){
            history.push("/error");
        }
    }, [isLoading]);

    return (
        <div id="Home">
            {isLoading
                ? (
                    <div className="ui active loader massive"></div>
                ) : (
                    <Fragment>
                        <div className="main flex column">
                            <h2 className="heading small primary-blue tight-shadow">Now Playing</h2>
                            <BannerSlider
                                items={nowPlaying}
                                className="title-card large"
                            />
                        </div>
                        <div className="secondary">
                            <MultiPanel
                                title="Coming Soon"
                                content={upcoming}
                            />
                            <MultiPanel
                                title="Popular"
                                content={popular}
                            />
                            <MultiPanel
                                title="Top Rated"
                                content={shuffle(topRated)}
                            />
                            <MultiPanel
                                title="Classics"
                                content={shuffle(classics)}
                            />
                        </div>
                    </Fragment>
                )
            }
        </div>
    );
}

const mapStateToProps = ({ homePage, login, user }) => {
    return {
        homePage,
        login,
        user
    };
};

export default connect(mapStateToProps, { getHomePageContent, getUserGenres })(Home);