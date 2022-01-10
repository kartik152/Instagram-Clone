let defaultState = {user: null, token: null};

if(JSON.parse(localStorage.getItem("user"))){
    defaultState = JSON.parse(localStorage.getItem("user"));
}

const authReducer = (state = defaultState, action) => {
    if(action.type === "USER_LOGGEDIN"){
        return {...state, ...action.payload}
    }
    if(action.type === "USER_LOGGEDOUT"){
        return null;
    }
    return state;
}

export default authReducer;