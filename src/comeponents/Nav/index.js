import React, { useContext,useState,useEffect } from 'react';
import {context} from '@/store'
import {getUserList} from '../../api/userApi'
import { withRouter } from 'react-router-dom'
import { Menu,Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './idnex.scss'

let Nav = function(props){
const [data,setData] =useState('');
const {state:userData,dispatch} = useContext(context)
let obj={
  name:userData.name
}
// 判断是否存在token
const islogin=!!userData.token

useEffect(async () => {
    const p=await getUserList({
      pageSize:1,
      page:1,
      query:JSON.stringify(obj)
    })
    //* 设置在state中
    setData(p.data[0])
  },[islogin])
const logout=()=>{
    dispatch({type:'logout'})
}
  const state = {
        menu: [
        {
            path: '/mine',
            text: '管理员信息'
        },
        {
            path: '/goods',
            text: '商品数据页'
        }, 
        {
            path: '/user',
            text: '用户数据页'
        }, 
        {
            path: '/order',
            text: '订单数据页'
        },
        ],
    }
    //* 跳转方法
    const goto = (path) => (
        props.history.push(path)
     )
    //  let timer=setInterval(()=>{
    //     new Date().toLocaleTimeString()
    //  },1000)
    return (
    <div className="app-nav">
        <div className="pic-card">
        <Avatar style={{ backgroundColor: '#cfcfcf' }} src={data.headPic} size={80} icon={<UserOutlined />} />
        {userData.token?<React.Fragment><p>欢迎 <span style={{color:'skyblue',cursor:"pointer"}} onClick={()=>goto('mine')}>{userData.name}</span></p><span style={{color:'skyblue',userSelect:"none",cursor:"pointer",fontSize:12}} onClick={logout}>退出登录</span></React.Fragment>:<p style={{color:'skyblue',userSelect:"none",cursor:"pointer"}} onClick={()=>goto('login')}>立即登录</p>}
        <p>
        <span>{new Date().toLocaleDateString()}</span> <br/>
        <span>{new Date().toLocaleTimeString()}</span>
        </p>
        </div>
       

        <Menu style={{textAlign:"center"}}  mode="vertical" selectedKeys={[props.location.pathname]} theme="dark" >
            {state.menu.map(item => (
                <Menu.Item key={item.path} onClick={()=>goto(item.path)}>
                    {item.text}
                </Menu.Item>))}
        </Menu>
    </div>
    )
}

//* 利用路由高阶组件给组件添加三个对象，用来获取参数
Nav=withRouter(Nav);
export default Nav;