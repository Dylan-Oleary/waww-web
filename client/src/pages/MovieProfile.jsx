import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";

import Jumbotron from '../components/Jumbotron';
import ContentModule from '../components/ContentModule';
import { getSelectedMovie, clearSelectedMovie } from '../redux/actions/movies';

const MovieProfile = ({ getSelectedMovie, clearSelectedMovie, selectedMovie, params }) => {
    let { movieID } = useParams();

    useEffect( () => {
        console.log(movieID);
        getSelectedMovie(movieID);

        return () => clearSelectedMovie();
    }, [movieID]);

    const renderContent = () => {
        if(selectedMovie === null){
            return (
                <div className="ui active loader massive"></div>
            )
        } else {
            return (
                <Fragment>
                    <Jumbotron movie={selectedMovie}/>
                    <ContentModule movie={selectedMovie} />
                </Fragment>
            )
        }
    }

    return (
        <div id="MovieProfile">
            {renderContent()}
        </div>
    )
}

const mapStateToProps = ({ selectedMovie }) => {
    return { selectedMovie };
}

export default connect(mapStateToProps, { getSelectedMovie, clearSelectedMovie  })(MovieProfile);