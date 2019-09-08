import React, {useCallback} from 'react'
import { connect } from 'react-redux';
import { useDropzone } from 'react-dropzone'

import { updateProfilePicture } from '../redux/actions/user';

const DropzoneField = ({ updateProfilePicture }) => {
  const onDrop = useCallback(acceptedFile => {
    const token = window.localStorage.getItem("token");
    
    console.log(acceptedFile[0])
    updateProfilePicture(token, acceptedFile[0])
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div id="ProfilePictureUpload" {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

export default connect(null, { updateProfilePicture })(DropzoneField);