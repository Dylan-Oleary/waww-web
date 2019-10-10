import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux';
import { useDropzone } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCloudUploadAlt as uploadIcon, 
  faExclamationTriangle as uploadRejectIcon,
  faCloudDownloadAlt as dropImageIcon
} from '@fortawesome/free-solid-svg-icons';

import { updateProfilePicture } from '../redux/actions/user';

const DropzoneField = ({ updateProfilePicture, user }) => {
    const [dropzoneIcon, setDropzoneIcon] = useState(uploadIcon);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [fileToUpload, setFileToUpload] = useState();
    const [isUploading, setIsUploading] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted(acceptedFile){
        setError(false);
        setFileToUpload(acceptedFile[0]);
    },
    onDropRejected(rejectedFile){
        setDropzoneIcon(uploadRejectIcon);
        setError(true);
        if(rejectedFile.length > 1){
        setErrorMessage("You can only upload one image! Try Again.");
        } else {
        setErrorMessage("This file is too large or it's extension is not supported.");
        }
    },
    onDragEnter(){
        setDropzoneIcon(dropImageIcon);
    },
    onDragLeave(){
        setDropzoneIcon(uploadIcon);
    },
    accept: '.jpeg,.jpg,.png',
    multiple: false,
    minSize: 0,
    maxSize: 2097152
    });

    const renderDropzoneBody = () => {
        if(!error){
            if(fileToUpload){
                if(isUploading){
                    return (
                        <Fragment>
                            <div>
                                <div className="ui active loader massive"></div>
                                <h5>Uploading your image...</h5>
                            </div>
                        </Fragment>
                    )
                } else {
                    return (
                        <img className="dropzone-preview" src={URL.createObjectURL(fileToUpload)} />
                    );
                }
            } else {
                return (
                    <Fragment>
                        <FontAwesomeIcon className="dropzone-icon" icon={dropzoneIcon} size="6x"/>
                        <h5>Drag and drop an image or click to open your file selector!</h5>
                        <p>Maximum image size: 2MB</p>
                    </Fragment>
                )
            }
        } else {
            return (
                <Fragment>
                    <FontAwesomeIcon className="dropzone-icon" icon={dropzoneIcon} size="6x"/>
                    <h5>{errorMessage}</h5>
                    <p>Maximum image size: 2MB</p>
                </Fragment>
            )
        }
    }

    const renderSubmitMenu = () => {
        return (
            <div className="submit-menu">
            <button className={`btn remove ${fileToUpload ? "" : "disabled"}`} disabled={fileToUpload ? false : true} onClick={() => setFileToUpload()}>Remove Image</button>
            <button className={`btn submit ${fileToUpload ? "" : "disabled"}`} disabled={fileToUpload ? false : true} onClick={() => handleSubmit()}>Submit</button>
            </div>
        );
    };

    const handleSubmit = () => {
        const token = window.localStorage.getItem("token");
        setIsUploading(true);

        updateProfilePicture(token, user._id, fileToUpload);
    };

    return (
    <div id="Dropzone">
        <div id="ProfilePictureUpload" {...getRootProps()}>
            <input 
                {...getInputProps()}
            />
            <div className="dropzone-body">
                {renderDropzoneBody()}
            </div>
        </div>
        {renderSubmitMenu()}
    </div>
    )
}

const mapStateToProps = ({ user }) => {
    return {
        user
    };
};

export default connect(mapStateToProps, { updateProfilePicture })(DropzoneField);