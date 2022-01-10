import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
const CreatePost = () => {
    const [title, settitle] = useState('');
    const [body, setbody] = useState('');
    const [image, setimage] = useState();
    const [url, seturl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    const fileChangeHandler = (e) => {
        setimage(e.target.files[0]);
    }

    useEffect(async() => {
        console.log(url);
        if(url){
            try{
                const response = await fetch("/createPost" ,{
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({                                          //data in place of body in axios
                        title: title,
                        body: body,
                        image: url
                    })
                })
                const data = await response.json();
                console.log(data);
                history.push("/");
                // console.log()
            }
            catch(e){
                console.log(e);
            }
        }

    }, [url])
    
    const submitHandler = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "Instagram-Clone");
        formData.append("cloud_name", "dikg9ldpj");
        try{
            setIsLoading(true);
            const cloudServerResponse = await fetch("https://api.cloudinary.com/v1_1/dikg9ldpj/image/upload", {
                method: "POST",
                body: formData
            })
            const data = await cloudServerResponse.json();
            console.log(data);
            if(data.error){
                throw new Error(data.error);
            }
            setIsLoading(false);
            seturl(data.url);
        }
        catch(e){
            console.log(e);
        }
    }

    return (
        <div className="mycard">
            <div className="card inputField auth-card">
                <form onSubmit={submitHandler}>
                    <input type="text" placeholder="title" onChange={(e) => {settitle(e.target.value)}} value={title}/>
                    <input type="text" placeholder="body" onChange={(e) => {setbody(e.target.value)}} value={body}/>
                    <div className="file-field input-field">
                    <div className="btn">
                        <span>File</span>
                        <input type="file" onChange={fileChangeHandler}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                    </div>
                    <button className="btn waves-effect" disabled={!title || !body || !image}>{isLoading ? <LoadingOutlined/> : "Submit Post"}</button>
                </form>
            </div>
        </div>
    )
}
export default CreatePost;