import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { getSelectedGenre, clearSelectedGenre } from '../redux/actions/genres';

const GenreDiscover = ({ params, selectedGenre, getSelectedGenre, clearSelectedGenre }) => {
    useEffect(() => {
        getSelectedGenre(params.genreID)

        return () => clearSelectedGenre();
    }, [])

    return (
        <div id="GenreDiscover">
            {
                selectedGenre && selectedGenre.movies.length ? <div>{selectedGenre.id}</div> : <div className="ui active loader massive"></div>
            }
        </div>
    )
}

const mapStateToProps = ({ selectedGenre }) => {
    return { selectedGenre };
}

export default connect(mapStateToProps, { getSelectedGenre, clearSelectedGenre })(GenreDiscover);