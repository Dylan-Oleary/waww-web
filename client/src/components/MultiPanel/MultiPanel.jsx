import React, { useEffect, useState, useRef } from 'react';

import MobileMultiPanel from './MobileMultiPanel';
import DesktopMultiPanel from './DesktopMultiPanel';

const MultiPanel = ({ title, content }) => {
    const windowWidth = useRef(window.window.innerWidth);
    const [isMobile, setIsMobile] = useState(window.window.innerWidth < 768 ? true : false);

    useEffect(() => {
        window.addEventListener('resize', () => setWindowWidth(window.window.innerWidth));

        return () => window.removeEventListener('resize', () => setWindowWidth(window.window.innerWidth));

    }, []);

    const setWindowWidth = width => {
        const previousWidth = windowWidth.current;

        windowWidth.current = width;
        
        if(windowWidth.current < 768 && previousWidth >= 768){
            setIsMobile(true);
        }
        if(windowWidth.current >= 768 && previousWidth < 768){
            setIsMobile(false);
        }
    };

    return (isMobile
        ? (
            <MobileMultiPanel
                content={content}
                title={title}
            />
        ) : (
            <DesktopMultiPanel
                content={content}
                title={title}
            />
        )
    );
};

export default MultiPanel;