export const LOGIN='login';
export const LOGOUT='logout';
export function login(user){
    return {type:LOGIN,user}
}

export function logout(){
    return {type:LOGOUT}
}

//! 在外部模块中利用bindActionCreators该方法会默认获取这两个
export default {
    login,
    logout
}