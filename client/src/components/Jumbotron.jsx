import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Parallax } from 'react-parallax';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStopCircle as removeFromWatchList, faPlayCircle as addToWatchList, faHeart as removeFromFavourites, faEye as addToViewed, faEyeSlash as removeFromViewed } from '@fortawesome/free-solid-svg-icons';
import { faHeart as addToFavourites } from '@fortawesome/free-regular-svg-icons';

import { updateWatchList, updateFavourites, updateViewed } from '../redux/actions/user';
import altImage from '../public/assets/images/case-white.svg';

const Jumbotron = ({ movie, updateWatchList, updateFavourites, updateViewed, user, login }) => {
    const bgImagestyle = { backgroundSize: 'contain' };
    const jumbotronImage = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
    const token = window.localStorage.getItem("token");

    const renderButtonMenu = () => {
        if(login.isLoggedIn){
            let appearsOnWatchList = false;
            let appearsOnFavourites = false;
            let appearsOnViewed = false;

            for(let i = 0; i < user.watchlist.length; i++){
                if(user.watchlist[i]._id === movie._id){
                    appearsOnWatchList = true;
                }
            }

            for(let i = 0; i < user.favourites.length; i++){
                if(user.favourites[i]._id === movie._id){
                    appearsOnFavourites = true;
                }
            }

            for(let i = 0; i < user.viewed.length; i++){
                if(user.viewed[i]._id === movie._id){
                    appearsOnViewed = true;
                }
            }

            return (
                <div className="button-row three-buttons">
                    <div className="flex-column">
                        <FontAwesomeIcon id="WatchListIcon" icon={appearsOnWatchList ? removeFromWatchList : addToWatchList } size="2x" onClick={() => updateWatchList(token, {_id: movie._id, tmdb_id: movie.tmdb_id, release_date: movie.release_date, poster_path: movie.poster_path, title: movie.title})} />
                        <p className="text small">{appearsOnWatchList ? "Remove from WatchList" : "Add to WatchList"}</p>
                    </div>
                    <div className="flex-column">
                        <FontAwesomeIcon id="ViewedListIcon" icon={appearsOnViewed ? removeFromViewed : addToViewed } size="2x" onClick={() => updateViewed(token, {_id: movie._id, tmdb_id: movie.tmdb_id, release_date: movie.release_date, poster_path: movie.poster_path, title: movie.title})} />
                        <p className="text small">{appearsOnViewed? "Remove from Viewed" : "Add to Viewed"}</p>
                    </div>
                    <div className="flex-column">
                        <FontAwesomeIcon id="FavouritesIcon" icon={appearsOnFavourites ? removeFromFavourites : addToFavourites } size="2x" onClick={() => updateFavourites(token, {_id: movie._id, tmdb_id: movie.tmdb_id, release_date: movie.release_date, poster_path: movie.poster_path, title: movie.title})}/>
                        <p className="text small">{appearsOnFavourites ? "Remove from Favourites" : "Add to Favourites"}</p>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="flex-column">
                    <div className="button-row three-buttons">
                        <FontAwesomeIcon id="WatchListIcon" icon={addToWatchList} size="2x" />
                        <FontAwesomeIcon id="WatchListIcon" icon={addToViewed} size="2x" />
                        <FontAwesomeIcon id="FavouritesIcon" icon={addToFavourites} size="2x" /> 
                    </div>
                    <p className="text small">Log in to bookmark, favourite and comment on this movie!</p>
                </div>
            )
        }
    }

    return (
        <Parallax className="jumbotron" bgImage={jumbotronImage} bgImageStyle={bgImagestyle} strength={150} >
            <div className="before"></div>
            <div className="column-centered layer-one">
                <img src={movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : altImage}/>
                <h2>{`${movie.title} (${movie.release_date.substring(0,4)})`}</h2>
                {renderButtonMenu()}
            </div>
        </Parallax>
    )
}

const mapStateToProps = ({ user, login }) => {
    return { user, login };
}

export default connect(mapStateToProps, { updateWatchList, updateFavourites, updateViewed })(Jumbotron);