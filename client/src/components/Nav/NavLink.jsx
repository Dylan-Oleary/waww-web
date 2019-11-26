import React, { Fragment, useRef, useState } from "react";
import { Link } from "react-router-dom";

const NavLink = ({ children, childClasses, childClick, label, path, button, isMobile }) => {
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
        if(isMobile && children){
            navWrapper.current.className = `nav-link ${showChildren ? "" : "active"}`
            setShowChildren(showChildren ? false : true);
        } else {
            setShowChildren(false);
            navWrapper.current.className = "nav-link";
        }
    }

    return (
        <div 
            className="nav-link"
            ref={navWrapper}
            onMouseEnter={isMobile ? null : () => handleMouseEnter()}
            onMouseLeave={isMobile ? null : () => handleMouseLeave()}
        >
            {isMobile && button
                ? (
                    button()
                ) : (
                    <Link
                        className="heading shadow"
                        to={children ? "#" : path}
                        onClick={isMobile ? () => handleItemClick() : null}
                    >
                        {label}
                    </Link>
                )
            }
            {(children && showChildren) && <Fragment>
                {!isMobile && <div className="border-block"></div>}
                <div className={`nav-link children flex ${childClasses}`}>
                    {children.map(child => {
                        return (
                            <div key={`nav-${path}-${child.id}`}>
                                <Link
                                    className="shadow"
                                    to={`${path}${child.slug}`}
                                    onClick={isMobile ? childClick : handleItemClick}
                                >
                                    {child.name}
                                </Link>
                            </div>
                        )
                    })}
                    {(button && showChildren && !isMobile) && <div>
                        {button(navWrapper)}
                    </div>}
                </div>
            </Fragment>}
        </div>
    );
};

export default NavLink;