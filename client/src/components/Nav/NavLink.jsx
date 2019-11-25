import React, { Fragment, useRef, useState } from "react";
import { Link } from "react-router-dom";

const NavLink = ({ children, childClasses, label, path, button }) => {
    const [showChildren, setShowChildren] = useState(false);
    const navWrapper = useRef();

    const handleMouseEnter = () => {
        if(children && children.length > 0){
            setShowChildren(true);
        }
        navWrapper.current.className = "nav-link active";
    };

    const handleMouseLeave = () => {
        if(children && children.length > 0){
            setShowChildren(false);
        }
        navWrapper.current.className = "nav-link";
    };

    const handleItemClick = () => {
        setShowChildren(false);
        navWrapper.current.className = "nav-link";
    }

    return (
        <div 
            className="nav-link"
            ref={navWrapper}
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => handleMouseLeave()}
        >
            <Link
                className="heading shadow"
                to={children ? "#" : path}
            >
                {label}
            </Link>
            {(children && showChildren) && <Fragment>
                <div className="border-block"></div>
                <div className={`nav-link children flex ${childClasses}`}>
                    {children.map(child => {
                        return (
                            <div key={`nav-${path}-${child.id}`}>
                                <Link
                                    className="shadow"
                                    to={`${path}${child.slug}`}
                                    onClick={handleItemClick}
                                >
                                    {child.name}
                                </Link>
                            </div>
                        )
                    })}
                    {(button && showChildren) && <div>
                        {button(navWrapper)}
                    </div>}
                </div>
            </Fragment>}
            
            
        </div>
    )
};

export default NavLink;