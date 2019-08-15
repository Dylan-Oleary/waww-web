import React from 'react';

import altImage from '../public/assets/images/case-white.svg';

const CardDeck = ({ content }) => {
    const renderCards = cardContent => {
        return cardContent.map( content => {
            return (
                <div className="profile-card" key={content.id}>
                    <div className="card-profile-image-wrapper">
                        <img className="fluid" src={content.profile_path ? `https://image.tmdb.org/t/p/original/${content.profile_path}` : altImage}/>
                    </div>
                    <div className="card-profile-details">
                        <p className="profile-header">{content.name}</p>
                        <p className="profile-header-secondary">{content.character}</p>
                    </div>
                </div>
            )
        })
    }

    return (
        <div id="CardDeck">
            {renderCards(content)}
        </div>
    )
}

export default CardDeck;