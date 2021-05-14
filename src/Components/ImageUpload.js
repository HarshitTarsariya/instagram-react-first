import React, { useState } from 'react'
import { Input, Button,LinearProgress } from '@material-ui/core';
import {storage,db} from '../Firebase'
import firebase from 'firebase'
import './ImageUpload.css'

function ImageUpload({username}) {
    const [caption,setCaption]=useState('')
    const [image,setImage]=useState(null)
    const [progress,setProgress]=useState(0)
    
    
    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }
    const handleUpload=()=>{
        const upload=storage.ref(`images/${image.name}`).put(image)
        upload.on(
            "state_changed",
            (snapshot)=>{
                const progress=Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                )
                setProgress(progress)
            },
            (error)=>{
                alert(error.message)
            },
            ()=>{
                storage.ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    db.collection('posts').add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imageurl:url,
                        username:username
                    })
                    setProgress(0)
                    setImage(null)
                    setCaption('')
                })
            }
        )
    }

    return (
        <div className="imageupload__upload">
            <Input placeholder="Caption" value={caption} onChange={(e)=>setCaption(e.target.value)} type="text"></Input>
            <Input type="file" onChange={handleChange}></Input>
            <LinearProgress variant="determinate" value={progress} />
            <Button onClick={handleUpload} disabled={!caption || !username || !image}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
