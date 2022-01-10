import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
    const dispatch = useDispatch();
    const authUser = useSelector(state => state.auth);
    console.log(authUser);    

    const logoutHandler = () => {
        dispatch({type: "USER_LOGGEDOUT"});
        localStorage.setItem("user", null);
    }

    return (
        <nav>
            <div class="nav-wrapper white">
            <Link to="/" class="brand-logo">Instagram</Link>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
                {
                    authUser && authUser.user ? 
                    (
                        <>
                            <li><Link to="/createPost">Create Post</Link></li>,
                            <li onClick={logoutHandler}><Link to="/">Logout</Link></li>
                        </>
                    )
                    :
                    (
                        <>
                            <li><Link to="/signin">Login</Link></li>,
                            <li><Link to="/signup">Signup</Link></li>
                        </>
                    )
                }
            </ul>
            </div>
        </nav>
    )
}
export default Navbar;