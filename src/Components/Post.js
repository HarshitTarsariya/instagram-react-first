import React, { useEffect, useState } from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar';
import { db } from '../Firebase';
import { Input,Button } from '@material-ui/core';
import firebase from 'firebase'

function Post({postId,user,username,caption,imageurl}) {
    const [comments,setComments]=useState([])
    const [comment,setComment]=useState('')

    useEffect(() => {
        let unsubs;
        if(postId){
            unsubs=db.collection("posts")
                    .doc(postId)
                    .collection("comments")
                    .orderBy("timestamp","asc")
                    .onSnapshot((snapshot)=>{
                        setComments(snapshot.docs.map(doc=>doc.data()))
                    })
        }
        return () => {
            unsubs()
        }
    }, [postId])
    const postComment=(e)=>{
        e.preventDefault()
        console.log(postId)
        db.collection("posts").doc(postId).collection("comments").add({
            text:comment,
            username:user,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }
    return (
        <div className="post">
            {/* header */}
            <div className="post__header">
                <Avatar className="post__avatar"
                    alt={username}
                    >
                </Avatar>
                <h3>{username}</h3>
            </div>
                {/* avatar name */}
            {/* image */}
            <img className="post__image" src={imageurl}/>
            {/* caption */}
            <h4 className="post__username"><strong>{username}</strong> {caption}</h4>
            {/* comment */}
            <div className="post__comments">
                {
                    comments.map((comment)=>(
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>
            <form className="post__commentbox">
                <Input className="post__input" 
                    placeholder="Add Comment"
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                >
                </Input>
                <Button disabled={!comment || user==null}
                    className="post__button"
                    type="submit"
                    onClick={postComment}
                >
                    Post
                </Button>
                
            </form>
        </div>
    )
}

export default Post