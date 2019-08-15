import React from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
 
const Carousel = ({ children, iFrame, videos }) => {
    const  settings = {
        customPaging: iFrame ? i => {
            return (
              <a>
                <img src={`http://i.ytimg.com/vi/${videos[i].key}/maxresdefault.jpg`} />
              </a>
            );
        } : null,
        dots: iFrame ? true : false,
        dotsClass: iFrame ? "slick-dots slick-thumb" : null,
        infinite: true,
        speed: 600,
        slidesToShow: iFrame ? 1 : 4,
        slidesToScroll: iFrame ? 1 : 4,
        className:"slider-inner"
    };

    return (
        <Slider {...settings} id="Carousel">
            {children}
        </Slider>
    )
}

const mapStateToProps = ({ selectedMovie }) => {
    return { videos: selectedMovie.videos };
}

export default connect(mapStateToProps)(Carousel);