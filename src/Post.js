import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase';

const Post = props => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    let unsubscribe;
    useEffect(()=>{
        if(props.postId) {
            
            unsubscribe = db
                            .collection("posts")
                            .doc(props.postId)
                            .collection("comments")
                            .orderBy("timestamp", "desc")
                            .onSnapshot(snapshot=>{
                                snapshot.docs.map(doc=>console.log(doc.data()));
                                setComments(snapshot.docs.map(doc=>doc.data()));
                            });
            return () => {
                unsubscribe();
            }
        }
    }, [props.postId]);

    const postComment = event => {
        event.preventDefault();
        db.collection("posts").doc(props.postId).collection("comments").add({
            text: comment,
            username: props.user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment("");
    }

    return (
        <div className="post">
            <div className="post_header">
                <Avatar
                    className="post_avatar"
                    alt="RafehQazi"
                    src="/static/images/avatar/1.jpg" />

                <h3>{props.username}</h3>
            </div>
            <img className="post_image" src={props.imageUrl} alt="post image" />
            <h4 className="post_text"><strong>{props.username}:</strong> {props.caption}</h4>
            {/* <p>Uploaded at: {props.timestamp}</p> */}
            <div className="post_comments">
                {comments.map(comment=>{
                    return <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                })}
            </div>
            {props.user && (<form className="post_commentBox">
                <input
                    className="post_input"
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}/>
                <button
                    className="post_button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}>
                        Comment
                </button>
            </form>)}
        </div>
    );
}

export default Post;