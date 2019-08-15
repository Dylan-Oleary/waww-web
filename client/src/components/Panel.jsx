import React from 'react';
import { connect } from 'react-redux';

import { showModal } from '../redux/actions/modal';

const Panel = ({ title, modalTitle, modalContent, modalType, children, showModal, className }) => {
    return (
        <div id="Panel" className={className}>
            <div className="panel-header">
                <h2>{title}</h2>
                {modalContent ? <p className="pointer" onClick={() => showModal(modalTitle, modalContent, modalType)}>{`See all ${modalTitle}(${modalContent.length})`}</p> : null}
            </div>
            {children}
        </div>
    )
}

export default connect(null, { showModal })(Panel);