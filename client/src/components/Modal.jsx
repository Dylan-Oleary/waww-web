import React, { useState } from 'react';
import { navigate } from 'hookrouter';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose as close } from '@fortawesome/free-solid-svg-icons';

import { deleteAccount } from '../redux/actions/user';
import { closeModal } from '../redux/actions/modal';
import altImage from '../public/assets/images/case-white.svg';

const Modal = ({ modal, closeModal, deleteAccount }) => {
    const { content, title, type } = modal.props;
    const [waitingForAPI, setWaitingForAPI] = useState(false)

    const navigateToMovieProfile = id => {
        closeModal()
        navigate(`/movies/${id}`)
    }

    const movieList = () => {
        return (
            <div className="modal-list">
                {
                    content.map( movie => {
                        return (
                            <div className="modal-list-item">
                               <img src={movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : altImage} />
                               <div className="modal-list-text">
                                    <p className="title-link" onClick={() => navigateToMovieProfile(movie.tmdb_id)} >{`${movie.title} (${movie.release_date.substring(0,4)})`}</p>
                                </div>
                            </div> 
                        )
                    })
                }
            </div>
        )
    }

    const profileList = () => {
        return (
            <div className="modal-list">
                {
                    content.map( profile => {
                        return (
                            <div className="modal-list-item">
                               <img src={profile.profile_path ? `https://image.tmdb.org/t/p/original/${profile.profile_path}` : altImage} />
                               <div className="modal-list-text">
                                    <p className="bold">{profile.name}</p>
                                    <p className="italic">{profile.character}</p>
                               </div>
                            </div> 
                        )
                    })
                }
            </div>
        )        
    }

    const deleteAccountModal = () => {
        const token = window.localStorage.getItem("token");
        const handleSubmit = token => {
            setWaitingForAPI(true);
            deleteAccount(token);
        }

        return (
            <div className="modal-list">
                <p className="text-medium">Deleting your account is permanent and cannot be undone!</p>
                { waitingForAPI ? <div className="ui active loader massive"></div> : <button className="ui button delete" onClick={() => handleSubmit(token)}>Delete Account</button> }
            </div>
        )
    }

    const modalContent = () => {
        switch(type){
            case "movieList" :
                return movieList();
            case "profileList" :
                return profileList();
            case "deleteAccount" :
                return deleteAccountModal()
            default :
                return null;
        }
    }

    if(modal.isOpen === true){
        return (
            <div id="Modal">
                <div className="modal-wrapper">
                    <div className="modal-header">
                        <div className="modal-actions flex">
                            <FontAwesomeIcon id="CloseIcon" icon={close} size="2x" onClick={closeModal} />
                        </div>
                        <h2>{title}</h2>
                    </div>
                    {modalContent()}
                </div>
            </div>
        )
    } else {
        return null;
    }
}

const mapStateToProps = ({ modal }) => {
    return { modal };
}

export default connect(mapStateToProps, { closeModal, deleteAccount })(Modal);