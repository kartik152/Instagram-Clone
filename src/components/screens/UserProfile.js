import { LoadingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import classes from "./Profile.module.css";
const UserProfile = () => {
    const [userProfile, setUserProfile] = useState();
    const [count, setCount] = useState(0);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const {userId} = useParams();
    const authUser = useSelector(state => state.auth);

    useEffect(async() => {
        try{
            const response = await fetch(`/user/${userId}`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json();
            console.log(data);
            setUserProfile(data);
        }
        catch(e){
            console.log(e);
        }
    
    }, [])

    useEffect(async() => {
        try{
            const response = await fetch("/allPost", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                    "Content-Type": "application/json"
                }
            })
            const posts = await response.json();
            let number = 0;
            const result = posts.map(post => {
                console.log(post.createdBy._id.toString() === userId.toString());
                if(post.createdBy._id.toString() === userId.toString()){
                    number++;
                    setCount(number);
                    return post;
                }
            })
            setPosts(result);
            console.log(result);
        }
        catch(e){
            console.log(e);
        }
    }, [])

    const followHandler = async(specificUserId) => {                         
        try{
            const response = await fetch("/follow", {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: specificUserId
                })
            })
            const data = await response.json();
            console.log(data);
            setUserProfile(data);
        }
        catch(e){
            console.log(e);
        }
    }

    const unfollowHandler = async(specificUserId) => {                         
        try{
            const response = await fetch("/unfollow", {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: specificUserId
                })
            })
            const data = await response.json();
            console.log(data);
            setUserProfile(data);
        }
        catch(e){
            console.log(e);
        }
    }

    const fileChangeHandler = async(e) => {
        const image = e.target.files[0];
        console.log("Is it working-1");
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "Instagram-Clone");
        formData.append("cloud_name", "dikg9ldpj");
        try{
            setIsLoading(true);
            console.log("Is it working-2");
            const cloudServerResponse = await fetch("https://api.cloudinary.com/v1_1/dikg9ldpj/image/upload", {
                method: "POST",
                body: formData
            })
            const data = await cloudServerResponse.json();
            if(data.error){
                throw new Error(data.error);
            }
            const response = await fetch("/updatePic", {
                method: "PATCH",
                body: JSON.stringify({
                    image: data.url
                }),
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                    "Content-Type": "application/json"
                },
            })
            const mainData = await response.json();
            setIsLoading(false);
            setUserProfile(mainData);
        }
        catch(e){
            console.log(e);
        }
    }

    return (
        <>
            {
                userProfile ? 
                <div style={{maxWidth: "700px", margin: "0px auto"}}>
                    <div className={classes.profile_section}>
                        <div>
                            <img className={classes.profile_image} src={userProfile.image}/>
                            <label htmlFor="file" className="btn" style={{marginLeft: "8px"}}>{isLoading ? <LoadingOutlined/> : "File"}</label>
                            <input id="file" type="file" onChange={fileChangeHandler} hidden/>
                        </div>
                        <div style={{textAlign: "center", margin: "0 10px"}}>
                            <h1>{userProfile && userProfile.name}</h1>
                            <div className={classes.following_section}>
                                <h4>{count} posts</h4>
                                <h4>{userProfile && userProfile.followers && userProfile.followers.length>0 ? userProfile.followers.length : "0"} followers</h4>                     {/* It is not reflecting back here when we refresh the page. So we have to use some state change by thsi when this state change -> it will now reflect back to here. So to do this we will set userProfile when we follow or unfollow the user. */}
                                <h4>{userProfile && userProfile.following && userProfile.following.length>0 ? userProfile.following.length : "0"} following</h4>
                            </div>
                            {
                                authUser.user._id.toString() !== userId &&
                                (
                                    <>
                                        {
                                            userProfile.followers && userProfile.followers.length>0 && userProfile.followers.includes(authUser.user._id) ? 
                                            <button
                                                className="btn waves-effect waves-light"
                                                type="submit"
                                                name="action"
                                                onClick={() => {unfollowHandler(userProfile._id)}}
                                            >
                                            unFollow
                                            </button> :
                                            <button
                                                className="btn waves-effect waves-light"
                                                type="submit"
                                                name="action"
                                                onClick={() => {followHandler(userProfile._id)}}
                                            >
                                            Follow
                                            </button>
                                        }
                                    </>
                                )
                            }
                        </div>
                    </div>

                    <div className={classes.gallery}>
                        {posts && posts.length>0 && posts.map(post => {
                            if(post !== undefined){
                                return <img src={post.image}/>
                            }
                        })}
                    </div>
                </div>
                : "No user Profile"
            }
        </>
    )
}


export default UserProfile;