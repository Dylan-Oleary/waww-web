import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { A } from 'hookrouter';
import Slider from 'react-slick';

import MultiPanel from '../components/MultiPanel';
import altLogo from '../public/assets/images/WAWW-pink.png';
import { getNowPlaying, getPopular, getTopRated, getUpcoming } from '../redux/actions/movies';
import { clearHomePage, getUserGenres } from '../redux/actions/pages';

const settings = {
    arrows: false,
    autoplay: true,
    className: 'home-slider',
    dots: false,
    pauseOnHover: true,
};

const genres = [
    { "id": 28, "name": "Action" },
    { "id": 12, "name": "Adventure" },
    { "id": 16, "name": "Animation" },
    { "id": 35, "name": "Comedy" },
    { "id": 80, "name": "Crime" },
    { "id": 99, "name": "Documentary" },
    { "id": 18, "name": "Drama" },
    { "id": 10751, "name": "Family" },
    { "id": 14, "name": "Fantasy" },
    { "id": 36, "name": "History" },
    { "id": 27, "name": "Horror" },
    { "id": 10402, "name": "Music" },
    { "id": 9648, "name": "Mystery" },
    { "id": 10749, "name": "Romance" },
    { "id": 878, "name": "Science Fiction" },
    { "id": 10770, "name": "TV Movie" },
    { "id": 53, "name": "Thriller" },
    { "id": 10752, "name": "War" },
    { "id": 37, "name": "Western" }
]

const Home = ({ clearHomePage, getUserGenres, getNowPlaying, getPopular, getTopRated, getUpcoming, homePage, login, user }) => {
    const { nowPlaying, popular, topRated, upcoming, userContent } = homePage;

    //Component Did Mount
    useEffect(() => {
        getNowPlaying();
        getPopular();
        getTopRated();
        getUpcoming();

        return () => clearHomePage();
    },[])

    useEffect(() => {
        if(login.isLoggedIn){
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
                                <A className="title-overlay" href={`/movies/${movie.id}`}>{`${movie.title} (${movie.release_date.substring(0,4)})`}</A>
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
                            <A className="title-overlay-small" href={`/movies/${movie.id}`}>{`${movie.title} (${movie.release_date.substring(0,4)})`}</A>
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
                {genres.map( genre => <A className="" href={`/genres/${genre.id}`} key={`${genre.id}-genre`}>{genre.name}</A>)}
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
                                userContent.genres && userContent.genres.length ?  <div className="home-message">Want more genres? Head over to your <span><A href="/users/account">account</A> to add some!</span></div> : <div className="home-message">Customize your home page by adding some of your favourite genres to your <span><A href="/users/account">account!</A></span></div>
                            ) : <div className="home-message"><span><A href="/login">Login</A></span> to see your favourite genres and customize your home page!</div>
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