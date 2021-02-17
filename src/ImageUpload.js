import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { db, storage } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';

const ImageUpload = props => {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState('');

    const handleChange = event => {
        if(event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    }

    const handleUpload = () => {
        let uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            snapshot => {
                // progress function
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)*100)
                setProgress(progress);
            },
            error => {
                // error function
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        setUrl(url);
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: props.username,
                            user_id: props.user_id,
                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                        setUrl("");
                    })
                    .catch(error => {
                        console.log(error);
                        alert(error.message);
                    })
            }
        )
    }

    return (
        <div className="imageupload">
            <progress className="imageupload_progress" value={progress} max="100" />
            <input
                type="text"
                placeholder="Enter a caption..."
                value={caption}
                onChange={event=>setCaption(event.target.value)} />
            <input
                type="file"
                onChange={handleChange} />
            <Button className="imageupload_button" onClick={handleUpload}>Upload</Button>
        </div>
    );
}

export default ImageUpload;