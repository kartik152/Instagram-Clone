import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classes from "./Home.module.css";
const Home = () => {
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState('');
    const authUser = useSelector(state => state.auth.user);
    const addComment = async(postId) => {
        if(text === ""){
            return;
        }
        try{
            const response = await fetch("/comment", {
                method: "PUT",
                body: JSON.stringify({
                    postId: postId,
                    text: text
                }),
                headers: {
                    "Authorization": JSON.parse(localStorage.getItem("user")).token,
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json();
            // console.log(data);
            const dataItem = posts.map(post => {
                if(post._id === data._id){
                    return data;
                }
                else{
                    return post;
                }
            })
            setText('');
            setPosts(dataItem);
        }
        catch(e){
            console.log(e);
        }
    }

    const likeHandler = async(postId) => {
        try{
            const response = await fetch(`/liked/${postId}`, {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json();
            // console.log(data);
            const dataItem = posts.map(post => {
                if(post._id === data._id){
                    return data
                }
                else{
                    return post
                }
            })
            setPosts(dataItem);
        }
        catch(e){
            console.log(e);
        }
    }

    const unlikeHandler = async(postId) => {
        try{
            const response = await fetch(`/unLiked/${postId}`, {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json();
            // console.log(data);
            const dataItem = posts.map(post => {
                if(post._id === data._id){
                    return data
                }
                else{
                    return post
                }
            })
            setPosts(dataItem);
        }
        catch(e){
            console.log(e);
        }
    }

    const deletePost = async(postId) => {
        console.log(postId);
        const doWannaDelete = prompt("Are you sure. Do you really wanna delete?(y/n)");
        if(doWannaDelete.toLowerCase() === "n"){
            return;
        }
        try{
            const response = await fetch(`/deletePost/${postId}`, {
                method: "delete",
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                }
            })
            const data = await response.json();
            console.log(data);
            const dataItem = posts.filter(post => {
                return post._id.toString() !== data._id.toString()
            })
            setPosts(dataItem);
        }
        catch(e){
            console.log(e);
        }
    }

    const deleteComment = async(postId, commentId) => {
        console.log(postId, commentId);
        try{
            const response = await fetch(`/deleteComment/${postId}`, {
                method: "PUT",
                body: JSON.stringify({
                    commentId: commentId
                }),
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json();
            console.log(data);
            const dataItem = posts.map(post => {
                if(post._id === data._id){
                    return data;
                }
                else{
                    return post;
                }
            })
            console.log(dataItem);
            setPosts([...dataItem]);
        }
        catch(e){
            console.log(e);
        }
    }

    useEffect(async() => {
        const response = await fetch("/allPost", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token
            }
        })
        const data = await response.json();
        console.log(data);
        setPosts(data);
    }, [])
    
    return (
        <div>
        {
            posts && posts.length>0 ? posts.map(post => {
                console.log(post);
                return (
                    <div className={`card ${classes.home_card} m-auto mt-4`}>
                        <h4>
                            <Link to={`/userProfile/${post.createdBy._id}`}>{post && post.createdBy && post.createdBy.name}</Link>
                            {
                                post.createdBy._id.toString() === authUser._id.toString() && 
                                (
                                    <>
                                        <i className="material-icons" style={{cursor: "pointer", float: "right"}}><Link to={`/updatePost/${post._id}`}>system_update</Link></i>
                                        <i className="material-icons" style={{float: "right", cursor: "pointer"}} onClick={() => {deletePost(post._id)}}>delete</i>
                                    </>
                                )
                            }
                        </h4>
                        <div className="card-image">
                            <img src={post.image}/>
                        </div>
                        <div className="card-content">
                            <i className="material-icons" style={{cursor: "pointer", width: "24px"}}>favorite_border</i>
                            {
                                post.like.includes(authUser._id) ? <i className="material-icons m-1" style={{cursor: "pointer", width: "24px"}} onClick={() => {unlikeHandler(post._id)}}>thumb_down</i> : <i className="material-icons m-1" style={{cursor: "pointer", width: "24px"}} onClick={() => {likeHandler(post._id)}}>thumb_up</i>
                            }
                            <h6> {post && post.like && post.like.length>=0 ? post.like.length : post.like.length} likes </h6>
                            <h6>{post.title}</h6>
                            <p>{post.body}</p>
                            {
                                post.comments.map(comment => {
                                    return (
                                        <div>
                                            <h4 style={{color: "red"}}>{comment.createdBy.name}</h4>
                                            <p>
                                                {comment.text}
                                                {
                                                    comment.createdBy._id.toString() === authUser._id.toString() &&
                                                    <i className="material-icons" style={{float: "right", cursor: "pointer"}} onClick={() => {deleteComment(post._id, comment._id)}}>delete</i>
                                                }
                                            </p>
                                        </div>
                                    )
                                })
                            }
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                addComment(post._id);
                                }
                                }>
                                <input type="text" placeholder="Add a comment" onChange={(e) => {setText(e.target.value)}} value={text}/>
                            </form>
                        </div>
                    </div>
                )
            })
            : "No Post Found"
        }
        </div>
    )
}
export default Home;