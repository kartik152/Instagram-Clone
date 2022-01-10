import {Input} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
const Signup = () => {
    const history = useHistory();
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [image, setImage] = useState(undefined);
    const [url, setUrl] = useState('');
    const fileHandler = (e) => {
        setImage(e.target.files[0]);
        fileUpload();
    }

    const fileUpload = async() => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "Instagram-Clone");
        formData.append("cloud_name", "dikg9ldpj");

        try{
            const cloudServerResponse = await fetch("https://api.cloudinary.com/v1_1/dikg9ldpj/image/upload", {
                method: "POST",
                body: formData
            })
            const data = await cloudServerResponse.json();
            console.log(data);
            if(data.error){
                throw new Error(data.error);
            }
            toast.success('Successfully created');
            setUrl(data.url);
        }
        catch(e){
            console.log(e);
        }
    }

    const submitHandler = async(e) => {
        e.preventDefault();
        console.log("Is it working");
        let data;
        if(image !== undefined){
            data = {
                name: name,
                email: email,
                password: password,
                image: url
            }
        }
        else{
            data = {
                name: name,
                email: email,
                password: password,
            }
        }
        try{
            console.log(data);
            const response = await axios({
                url: "/signup",
                method: "post",
                data: data,
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if(response.data.error){
                throw new Error(response.data.error);
            }
            history.push("/signin");
        }
        catch(e){
            console.log(e.message);
        }
    }

    return (
        <div className="mycard">
             <div className="card auth-card input-field">
                 <h2 class="card-title">Instagram</h2>
                 <form onSubmit={submitHandler}>
                    <Input placeholder="Enter your username" onChange={(e) => setname(e.target.value)} value={name}/>
                    <Input placeholder="Enter your email" type="email" onChange={(e) => setemail(e.target.value)} value={email}/>
                    <Input.Password placeholder="Enter your password" value={password} iconRender={visible => (visible ? <EyeTwoTone style={{float: "right"}} value={password}/> : <EyeInvisibleOutlined style={{float: "right"}}/>)} onChange={(e) => setpassword(e.target.value)} />
                    <div className="file-field input-field">
                        <div className="btn">
                            <label htmlFor="File" style={{color: "white"}}>Choose File</label>
                            <input type="file" id="File" hidden onChange={fileHandler} value={image}/>
                        </div>
                    </div>
                    <button
                        className="btn waves-effect waves-light"
                        type="submit"
                        name="action"
                        disabled={!email || !name || !password}
                    >
                        Submit
                    </button>
                 </form>
                 <p><Link to="/signin">Already have an account?</Link></p>
                 <ToastContainer />
             </div>
        </div>
    )
}
export default Signup