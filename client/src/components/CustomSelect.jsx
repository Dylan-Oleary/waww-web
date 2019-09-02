import React, { useState } from 'react';
import { navigate } from 'hookrouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown as open, faCaretUp as close} from '@fortawesome/free-solid-svg-icons';

import OutsideClickDetect from '../components/OutsideClickDetect';

const CustomSelect = ({ options, initial, onChange, column, size, background }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelection = option => {
        setIsOpen(false);
        onChange(option)
    }

    return (
        <div id="CustomSelect" className={`${size} ${background ? 'background' : ''}`} >
            <OutsideClickDetect state={isOpen} setState={setIsOpen}>
                <div className="selected" onClick={() => isOpen ? setIsOpen(false) : setIsOpen(true)} >
                    <span>{initial}</span>
                    <FontAwesomeIcon icon={isOpen ? close : open} />
                </div>
                <div className={isOpen ? 'options open' : 'options'} >
                    {options.map(option => <div className={column ? 'select-option column' : 'select-option'} key={`option-${option.id}`} onClick={ () => handleSelection(option) }>{option.name}</div>)}
                </div>
            </OutsideClickDetect>
        </div>
    )
}

export default CustomSelect;