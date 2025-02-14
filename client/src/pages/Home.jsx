import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import Slider from 'react-slick';

import MultiPanel from '../components/MultiPanel';
import altLogo from '../public/assets/images/WAWW-pink.png';
import { getNowPlaying, getPopular, getTopRated, getUpcoming } from '../redux/actions/movies';
import { clearHomePage, getUserGenres } from '../redux/actions/pages';
import { genres } from '../constants';
import { setBrowserTitle } from "../utils/browserTitle";

const settings = {
    arrows: false,
    autoplay: true,
    className: 'home-slider',
    dots: false,
    pauseOnHover: true,
};

const Home = ({ clearHomePage, getUserGenres, getNowPlaying, getPopular, getTopRated, getUpcoming, homePage, login, user }) => {
    const { nowPlaying, popular, topRated, upcoming, userContent } = homePage;
    const history = useHistory();

    //Component Did Mount
    useEffect(() => {
        getNowPlaying();
        getPopular();
        getTopRated();
        getUpcoming();
        setBrowserTitle(`WAWW | Home`);
    },[])

    useEffect(() => {
        if(user._id){
            getUserGenres(user.genres)
        } else {
            getNowPlaying();
            getPopular();
            getTopRated();
            getUpcoming();
        }
    }, [user])

    const renderSlider = () => {
        return (
            <Slider {...settings}>
                {nowPlaying.map(movie => {
                    return (
                        <div className="home-slider-wrapper">
                            <div className="home-slider-content" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`}}>
                                <Link className="title-overlay" to={`/movies/${movie._id}`}>{`${movie.title} (${movie.release_date.substring(0,4)})`}</Link>
                            </div>
                        </div>
                    )
                })}
            </Slider>
        )
    }

    const renderUpcoming = () => {
        return (
            <div className="upcoming-wrapper">
                {upcoming.map(movie => {
                    const bgImage = movie.backdrop_path === null ? `url(${altLogo})` : `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`;

                    return (
                        <div className="upcoming-content" style={{ backgroundImage: bgImage }}>
                            <Link className="title-overlay-small" to={`/movies/${movie._id}`}>{`${movie.title} (${movie.release_date.substring(0,4)})`}</Link>
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderMultiPanels = () => {
        return (
            <Fragment>
                <MultiPanel title="Popular" content={popular} />
                <MultiPanel title="Critically Acclaimed" content={topRated} />
            </Fragment>
        )
    }

    const renderSideBar = () => {
        return (
            <div className="sticky">
                <h3>Discover</h3>
                {genres.map( genre => <span className="" onClick={() => history.push(`/discover/${genre.slug}`)} key={`${genre.id}-genre`}>{genre.name}</span>)}
            </div>
        )
    }

    const renderUserGenreMultiPanels = () => {
        return (
            <Fragment>
                <div className="home-message">Your Favourite Genres At A Glance</div>
                {
                    userContent.genres.map(genre => {
                        return <MultiPanel title={genre.name} content={genre.movies} key={`user-genre-panel-${genre.name}`}/>
                    })
                }
            </Fragment>
        )
    }

    return (
        <div id="Home">
            {
                (upcoming && upcoming.length) && (nowPlaying && nowPlaying.length) ? (
                    <Fragment>
                        <div className="home-main">
                            <div className="main-theatres">
                                <h2>In Theatres</h2>
                                {renderSlider()}
                            </div>
                            <div className="main-upcoming">
                                <h2>Upcoming</h2>
                                {renderUpcoming()}
                            </div>
                        </div>
                        <div className="home-main-break"></div>
                    </Fragment>
                ) : <div className="ui active loader massive"></div>
            }
            {
                (popular && popular.length) && (topRated && topRated.length) ? (
                    <Fragment>
                        <div className="home-module">
                            <div className="home-module-panels">
                                {renderMultiPanels()}
                                {
                                    login.isLoggedIn ? (
                                        userContent.genres && userContent.genres.length ? renderUserGenreMultiPanels() : null
                                    ) : (
                                        null
                                    )
                                }
                            </div>
                            <div className="home-module-sidebar">
                                {renderSideBar()}
                            </div>
                        </div>
                        {
                            login.isLoggedIn ? (
                                userContent.genres && userContent.genres.length ?  <div className="home-message">Want more genres? Head over to your <span><Link to="/users/account">account</Link> to add some!</span></div> : <div className="home-message">Customize your home page by adding some of your favourite genres to your <span><Link to="/users/account">account!</Link></span></div>
                            ) : <div className="home-message"><span><Link to="/login">Login</Link></span> to see your favourite genres and customize your home page!</div>
                        }
                        <div className="home-message"></div>
                    </Fragment>
                ) : <div className="ui active loader massive"></div>
            }
        </div>
    )
}

const mapStateToProps = ({ homePage, login, user }) => {
    return { homePage, login, user }
}

export default connect(mapStateToProps, { getNowPlaying, getUserGenres, getPopular, getTopRated, getUpcoming, clearHomePage })(Home);