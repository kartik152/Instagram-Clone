import { Input } from "antd";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

const UpdatePost = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const history = useHistory();
    const {postId} = useParams();
    useEffect(async() => {
        console.log(postId);
        const response = await fetch(`/post/${postId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token
            }
        })
        const data = await response.json();
        console.log(data);
        setTitle(data.title);
        setBody(data.body);
    }, [])

    const submitHandler = async(e) => {
        e.preventDefault();
        try{
            const response = await fetch(`/updatePost/${postId}`, {
                method: "PATCH",
                body: JSON.stringify({
                    title: title,
                    body: body
                }),
                headers: {
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json();
            console.log(data);
            history.push("/");
        }
        catch(e){
            console.log(e);
        }
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 class="card-title">Instagram</h2>
                <form onSubmit={submitHandler}>
                    <Input placeholder="Enter Title" onChange={(e) => setTitle(e.target.value)} value={title}/>
                    <Input placeholder="Enter Body" onChange={(e) => {setBody(e.target.value)}} value={body}/>
                    <button
                        className="btn waves-effect waves-light"
                        type="submit"
                        name="action"
                        disabled={!title || !body}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UpdatePost;