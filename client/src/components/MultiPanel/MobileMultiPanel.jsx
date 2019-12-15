import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkSquareAlt } from "@fortawesome/free-solid-svg-icons";

import altLogo from '../../public/assets/images/WAWW-pink.png';

const MobileMultiPanel = ({ content, title }) => {
    const onError = event => {
        event.target.src = altLogo;
    };

    return (
        <div id="MobileMultiPanel">
            <div className="flex between">
                <h4>{title}</h4>
                <Link
                    className="waww-primary"
                >
                    <FontAwesomeIcon
                        icon={faExternalLinkSquareAlt}
                    />
                </Link>
            </div>
            <div className="mosaic">
                {content.slice(0,4).map((item, index) => (
                    <div
                        className="img-wrapper"
                        key={`${title}-${item.label}-${index}`}
                    >
                        <img
                            src={item.poster_path}
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
    );
};

export default MobileMultiPanel;