import React, { useState } from 'react';
import { Button } from "@material-ui/core";
import firebase from "firebase";
import { storage, db } from "./firebase";
import './ImageUpload.css';


function ImageUpload({username}) {
    const [image, setImage] = useState('');
    const [progress, setProgress] = useState(''); 
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]); //Pick only the 1st file just incase user selects multiple files
        }
    };

        const handleUpload = () => {
            const uploadTask = storage.ref(`images/${image.name}`).put(image); // grab the image file name

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // progress function...
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    // Error function...  
                    console.log(error);
                    alert(error.message);
                },
                () => {
                    // complete function ...
                    storage
                        .ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then(url => {
                            // post image inside db
                            db.collection("posts").add({
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                caption: caption,
                                imageUrl: url,
                                username: username
                            });

                            setProgress(0);
                            setCaption("");
                            setImage(null);
                        })
                }
            )
        }
    return (
        <div className="imageupload">
 
            {/* I want to have a...*/}
            {/* Caption input...*/}
            {/* File Picker*/}
            {/* Post Button*/}

            <progress className="imageupload__progress" value={progress} max="100"></progress>
            <input type="text" placeholder='Enter a caption...' onChange={event => setCaption(event.target.value)}value={caption}></input>
            <input type="file" onChange={handleChange}></input>
            <Button className="imageupload__button" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
