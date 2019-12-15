import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";

import altLogo from "../../public/assets/images/WAWW-pink.png";

const sliderSettings = {
    arrows: false,
    autoplay: true,
    className: 'banner-slider',
    dots: false,
    pauseOnHover: true,
};

const BannerSlider = ({ items, className }) => {
    const onError = event => {
        event.target.src = altLogo;
    };

    return (
        <div id="BannerSlider">
            <Slider {...sliderSettings}>
                {items.map(item => (
                    <div
                        className={className}
                        key={`banner-slider-${item._id}`}
                    >
                        <img
                            src={item.backdrop_path}
                            alt={item.label}
                            onError={onError}
                        />
                        <Link
                            className="title-overlay"
                            to={item.path}
                        >
                            {item.label}
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default BannerSlider;