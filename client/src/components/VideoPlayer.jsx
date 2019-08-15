import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import altImage from '../public/assets/images/case-white.svg';

const VideoPlayer = ({ videos }) => {
    const [currentVideo, setCurrentVideo] = useState(videos[0]);
    const [videoURL, setCurrentVideoURL] = useState(null);

    useEffect(() => {
        if(currentVideo.site === "YouTube"){
            setCurrentVideoURL(`https://www.youtube.com/embed/${currentVideo.key}?vq=hd1080`);
        }
        if(currentVideo.site === "Vimeo"){
            setCurrentVideoURL(`https://player.vimeo.com/video/${currentVideo.key}`);
        }
    }, [currentVideo]);

    return (
        <div id="VideoPlayerWrapper">
            <div id="VideoPlayer">
                <iframe 
                    src={videoURL}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                >
                </iframe>
            </div>
            <div id="VideoPlayerControls">
                { 
                    videos.slice(0, 5).map( (video, index) => {
                        const thumbnail = video.key === 'xHuOtLTQ_1I' ? altImage : `http://i.ytimg.com/vi/${video.key}/maxresdefault.jpg`;
                        return (
                            <div className={currentVideo.key === video.key ? "selected-video video-thumb pointer" : "video-thumb pointer"} key={video.key} onClick={() => setCurrentVideo(videos[index])} >
                                <img src={thumbnail}/>
                                <p>{video.name}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

const mapStateToProps = ({ selectedMovie }) => {
    return { videos: selectedMovie.videos };
}

export default connect(mapStateToProps)(VideoPlayer);