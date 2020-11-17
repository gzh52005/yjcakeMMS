import React, { useContext} from 'react';
import {withRouter } from 'react-router-dom'

import {context} from '../../store'

import { Button, Col, Row } from 'antd';


let Head =function(props){
// console.log('Head',props);
    const {state:data,dispatch} = useContext(context)

    // *判断是否登入
    const  isLogin= !!data.token
   
   const goto = (path) => (
       props.history.push(path)
    )
    // 退出登录
    const logout=()=>(
        dispatch({type:'logout'})
    )
    return (
        <Row justify='space-between' style={{ height: 100 + '%', paddingLeft: 20 }} align='middle'>
        <Col xs={12}>
            <h1 style={{ margin: 0 }}>后台管理系统</h1>
        </Col>
        <Col style={{ textAlign: "right",paddingRight:20 }} xs={12}>

            {
                //! 判断是否存在最新的token值，存在就显示退出按钮，点击退出按钮就会清空本地储存，但是由于组件没刷新会出现不显示注册登录
                //! 此时可以用强制刷新(但函数组件没有生命钩子和this的强制刷新)，也可以用高阶组件改变props值来进行组件刷新（推荐）
             
                isLogin?<Button type='link' onClick={logout}>退出</Button>:
                    <React.Fragment>
                        <Button type="link" onClick={()=>goto('login')}>登录</Button>
                        <Button type="link" onClick={()=>goto('reg')}>注册</Button>
                    </React.Fragment>
            }

        </Col>
    </Row>
    )
}
Head=withRouter(Head);
export default Head;