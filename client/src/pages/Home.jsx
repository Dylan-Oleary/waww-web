import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";

import BannerSlider from "../components/BannerSlider";
import MultiPanel from "../components/MultiPanel";
import { getNowPlaying, getPopular, getTopRated, getUpcoming } from '../redux/actions/movies';
import { getUserGenres } from '../redux/actions/pages';
import { genres } from '../constants';
import { setBrowserTitle } from "../utils/browserTitle";

const Home = ({ getUserGenres, getNowPlaying, getPopular, getTopRated, getUpcoming, homePage, login, user }) => {
    const { nowPlaying, popular, topRated, upcoming, userContent } = homePage;
    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory();

    //TODO: Gather calls more efficiently
    useEffect(() => {
        if(nowPlaying.length === 0 || upcoming.length === 0 || popular.length === 0){
            getNowPlaying();
            getPopular();
            // getTopRated();
            getUpcoming();
            setBrowserTitle(`WAWW | Home`);
        } else {
            setIsLoading(false);
        }
    },[nowPlaying, upcoming, popular])

    const renderSideBar = () => {
        return (
            <div className="sticky">
                <h3>Discover</h3>
                {genres.map( genre => <span className="" onClick={() => history.push(`/discover/${genre.slug}`)} key={`${genre.id}-genre`}>{genre.name}</span>)}
            </div>
        )
    }

    return (
        <div id="Home">
            {isLoading 
                ? (
                    <div className="ui active loader massive"></div>
                ) : (
                    <Fragment>
                        <div className="main flex column">
                            <BannerSlider
                                items={nowPlaying}
                                className="title-card large"
                            />
                        </div>
                        <hr className="break"/>
                        <div className="secondary">
                            <MultiPanel
                                title="Coming Soon"
                                content={upcoming}
                            />
                            <MultiPanel
                                title="Popular"
                                content={popular}
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

export default connect(mapStateToProps, { getNowPlaying, getUserGenres, getPopular, getTopRated, getUpcoming })(Home);