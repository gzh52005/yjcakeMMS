import React,{ useReducer } from "react";
// import * as all from 'redux' 查看模块所有方法
//! 解决数据刷新就没了的问题，vuex中也有这个bug
let currentUser = localStorage.getItem('currentUser');
let currentUser2 = sessionStorage.getItem('currentUser');
try{
    currentUser = JSON.parse(currentUser)||JSON.parse(currentUser2)||{}
}catch(err){
    currentUser = {}
}
const initState = {
   ...currentUser
};

const reducer = (state, action) => {
    let newState = {};
    switch (action.type) {
        case 'login':
            // 存入本地
            newState={name:action.user.name,remember:action.user.remember}
            let data={...newState,token:action.data.token}
            if(action.data.token){
                localStorage.setItem('currentUser',JSON.stringify(data))
            }else{
                sessionStorage.setItem('currentUser',JSON.stringify(data))
            }
            //!!!坑  这里应该把是否登录的状态一起设置在新的state中，这样子组件中的props才有这个状态
            newState = data;
            return newState;
        case 'logout':
            localStorage.removeItem('currentUser')
            sessionStorage.removeItem('currentUser')
            return {}
        case 'change_password':
            newState = {...state,password:action.password}
            return newState;
        case 'change_role':
            newState = {...state,role:action.role}
            return newState;
        case 'add':
            return [action.goods, ...state];
        case 'remove':
            return state.filter(item => item.name != action.name);
        case 'change':
            return state.map(item => {
                if (item.name === action.name) {
                    item.qty = action.qty;
                }
                return item;
            })
        case 'clear':
            return []
        default:
            throw new Error('type error');
    }
}

// 要遵循唯一数据源原则，useReducer只能使用一次
// 解决方案：在当前文件中使用一次reducer后，并利用Context技术把数据共享出去
export const context = React.createContext(null);
export const Provider = function(props){
    const [state,dispatch] = useReducer(reducer,initState)
    return (
        <context.Provider value={{state,dispatch}}>
            {props.children}
        </context.Provider>
    )
} 