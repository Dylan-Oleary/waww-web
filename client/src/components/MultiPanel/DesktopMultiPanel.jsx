import React from "react";
import { Link } from "react-router-dom";

import altLogo from '../../public/assets/images/WAWW-pink.png';

const DesktopMultiPanel = ({ title, content }) => {
    const onError = event => {
        event.target.src = altLogo;
    };

    return (
        <div id="DesktopMultiPanel">
            <div className="flex between title-row">
                <h2 className="heading small primary-blue tight-shadow">{title}</h2>
                <Link
                    className="ui button waww-primary"
                >
                    See More
                </Link>
            </div>
            <div className="content">
                <div className="main-img">
                    <img
                        src={content[0].backdrop_path}
                        alt={content[0].label}
                        onError={onError}
                    />
                    <Link
                        className="title-overlay"
                        to={content[0].path}
                    >
                        {content[0].label}
                    </Link>
                </div>
                <div className="secondary-imgs">
                    {content.slice(1,3).map((item, index) => (
                        <div key={`${title}-${item.label}-${index}`}>
                            <img
                                src={item.backdrop_path}
                                alt={item.label}
                                onError={onError}
                            />
                            <Link
                                className="title-overlay small"
                                to={item.path}
                            >
                                {item.label}
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="secondary-imgs">
                    {content.slice(3,5).map((item, index) => (
                        <div key={`${title}-${item.label}-${index}`}>
                            <img
                                src={item.backdrop_path}
                                alt={item.label}
                                onError={onError}
                            />
                            <Link
                                className="title-overlay small"
                                to={item.path}
                            >
                                {item.label}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DesktopMultiPanel;