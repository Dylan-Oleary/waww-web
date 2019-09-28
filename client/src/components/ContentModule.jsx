import React, { Fragment, useState } from 'react';
import { Parallax } from 'react-parallax';

import CardDeck from './CardDeck';
import ListViewCard from './ListViewCard';
import ReviewSection from "./ReviewSection";
import Panel from './Panel';
import Carousel from './Carousel';
import VideoPlayer from './VideoPlayer';
import { formatGenres } from '../utils/genreFormatter';
import { formatBudget } from '../utils/budgetFormatter';

const ContentModule = ({ movie }) => {
    const tabs = [
        { key: 0, name: "Overview"},
        { key: 1, name: "Comments"}
    ];

    const [currentTab, setCurrentTab] = useState(tabs[1]);
    const inlineBackdropImage = movie.images.backdrops && movie.images.backdrops.length ? (
        movie.images.backdrops.length > 1 ? `https://image.tmdb.org/t/p/original/${movie.images.backdrops[1].file_path}` : `https://image.tmdb.org/t/p/original/${movie.images.backdrops[0].file_path}`
    ) : null

    const renderCrew = () => {
        const crew = [
            {role: "Director", crewMembers: movie.crew.filter( crew => crew.job === "Director")},
            {role: "Writers", crewMembers: movie.crew.filter( crew => crew.job === "Screenplay")},
            {role: "Producers", crewMembers: movie.crew.filter( crew => crew.job === "Producer")},
            {role: "Music", crewMembers: movie.crew.filter( crew => crew.job === "Original Music Composer")},
        ];

        var renderedCrew = [];
        for(let i = 0; i < crew.length; i++){
            renderedCrew.push(
                <div key={`${crew[i].role}-overview`} className="overview-item">
                    <h3>{crew[i].role}</h3>
                    {
                        crew[i].crewMembers.length === 0 ? (
                            <p>N/A</p>
                        ) : (
                            crew[i].crewMembers.map(member => {
                                return <p key={`${member.credit_id}-${member.name}`}>{member.name}</p>
                            })
                        )
                    }
                </div>
            )
        }
        return renderedCrew;
    }

    const renderCast = () => {
        return movie.cast.length ? (
            <Panel title="Top Cast" modalContent={movie.cast} modalTitle={"Cast"} modalType={"profileList"}>
                <CardDeck content={movie.cast.slice(0,5)} />
            </Panel>
        ) : null
    }

    const renderVideoPlayer = () => {
        return movie.videos.length ? (
            inlineBackdropImage === null ? (
                <Panel title="Media" className="inverted">
                    <VideoPlayer />
                </Panel>
            ) : (
                <Parallax bgImage={inlineBackdropImage ? inlineBackdropImage : null} bgImageStyle={{ backgroundSize: 'contain' }} strength={150}>
                    <div className="inline-jumbo-before"></div>
                    <Panel title="Media" className="inverted padded">
                        <VideoPlayer />
                    </Panel>
                </Parallax>
            )
        ) : null
    }

    const renderRecommendations = () => {
        return movie.recommendations.length ? (
            <Panel title="Recommendations" modalContent={movie.recommendations} modalTitle={"Recommendations"} modalType={"movieList"}>
                <Carousel iFrame={false}>
                    { movie.recommendations.map(movie => <ListViewCard movie={movie} key={movie._id} />) }
                </Carousel>
            </Panel>
        ) : null
    }

    const renderSection = tab => {
        switch(tab.key){
            case 0 :
                return (
                    <Fragment>
                        <Panel title="Synopsis/Info">
                            <p className="text medium">{movie.overview}</p>
                            <div className="overview-details">
                                <div className="overview-detail-column">
                                    {renderCrew()}
                                </div>
                                <div className="vertical-hr"></div>
                                <div className="overview-detail-column right">
                                    <div className="overview-item">
                                        <h3>Genres</h3>
                                        <p>{movie.genres.length === 0 ? "N/A" : formatGenres(movie.genres)}</p>
                                    </div>
                                    <div className="overview-item">
                                        <h3>Runtime</h3>
                                        <p>{movie.runtime === 0 ? "N/A" : `${movie.runtime} minutes`}</p>
                                    </div>
                                    <div className="overview-item">
                                        <h3>Budget</h3>
                                        <p>{movie.budget === 0 ? "N/A" : formatBudget(movie.budget)}</p>
                                    </div>
                                    <div className="overview-item">
                                        <h3>Production Companies</h3>
                                        {movie.production_companies.length === 0 ? <p>N/A</p> : movie.production_companies.map(company => <p key={company.id}>{company.name}</p>)}
                                    </div>
                                </div>
                            </div>
                        </Panel>
                        {renderCast()}
                        {renderVideoPlayer()}
                        {renderRecommendations()}
                    </Fragment>
                )
            case 1 :
                return (
                    <ReviewSection movieID={movie._id} reviewIDs={movie.reviews}/>
                )
        }
    }
    
   return (
       <div id="ContentModule">
           <div className="tabs-wrapper">
            {
                tabs.map( tab => {
                    return <h2 className={currentTab.key === tab.key ? "tab selected-tab" : `tab deselected-tab ${tab.key === 0 ? "left-tab" : "right-tab"}`} onClick={() => setCurrentTab(tabs[tab.key])} key={tab.key}>{tab.name}</h2>
                })
            }
           </div>
           <div className="flex-column content-body">
                {renderSection(currentTab)}
           </div>
       </div>
   )
    
}

export default ContentModule;