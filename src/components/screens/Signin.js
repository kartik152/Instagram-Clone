import {Input} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
const Signin = () => {
    const history = useHistory();
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const dispatch = useDispatch();
    const submitHandler = async(e) => {
        e.preventDefault();
        const data = {
            email: email,
            password: password
        }
        try{
            const response = await axios({
                url: "/signin",
                method: "post",
                data: data,
            })
            if(response.data.error){
                throw new Error(response.data.error);
            }
            localStorage.setItem("user", JSON.stringify(response.data));
            dispatch({type: "USER_LOGGEDIN", payload: response.data});
            history.push("/");
        }
        catch(e){
            console.log(e.message);
            toast.error(e.message);
        }
    }

    return (
        <div className="mycard">
             <div className="card auth-card input-field">
                 <h2 class="card-title">Instagram</h2>
                 <form onSubmit={submitHandler}>
                    <Input placeholder="Enter your email" onChange={(e) => setemail(e.target.value)} value={email}/>
                    <Input.Password placeholder="Enter your password" value={password} iconRender={visible => (visible ? <EyeTwoTone style={{float: "right"}}/> : <EyeInvisibleOutlined style={{float: "right"}}/>)} onChange={(e) => setpassword(e.target.value)} />
                    <button
                        className="btn waves-effect waves-light"
                        type="submit"
                        name="action"
                        disabled={!email || !password}
                    >
                        Submit
                    </button>
                    <ToastContainer />
                 </form>
                 <p><Link to="/signup">Don't have an account?</Link></p>
             </div>
        </div>
    )
}
export default Signin;