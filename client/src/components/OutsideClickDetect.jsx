import React, { useRef, useEffect } from 'react';

const useOutsideAlerter = (ref, state, setState) => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        //If menu is open, close it
        if(state === true){
            setState(false);
        }
      }
    }
  
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    });
}

const OutsideClickDetect = ({ className, state, setState, children }) => {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, state, setState);

    return <div className={className} ref={wrapperRef}>{children}</div>;

}

export default OutsideClickDetect;