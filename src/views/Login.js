import React, { useState, useEffect, useMemo, useCallback, useContext, useReducer } from 'react';
import CryptoJS from 'crypto-js';
import { Form, Input, Button, Checkbox,message } from 'antd';
import request from '@/utils/request'
import { searchFormat } from '@/utils'//截取stat路由传参

import {context} from '../store'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 6 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 6 },
};
function Login(props) {
const {state:goodslist,dispatch} = useContext(context)
  //* 判断是否路由携带用户名参数过来，用常量接收
  const defaultUsername = props.location.state ? props.location.state.username : ''


  const add2cart = useCallback((data,user)=>{
    dispatch({type:'login',data,user})
},[])
  //! 验证成功发送请求

  const onFinish = async function (values) {
    //* 先把密码加密进行匹配
    const {name}=values
    const password = CryptoJS.SHA256(values.password).toString();
    const data = await request('/user/login', {
      name,
      password
    });
    // console.log('data=', data);
    //* 如果校验成功
    if (data.code === 2000) {
     
    //!!   明天用hook将登录状态存在全局context中？？就是返回新的state放在最大的组件上，所有子组件都能通过props获取
    add2cart(data,values)
    //   props.login(data.data,values.remember)

      //* 判断是不是从别的地方点击的登录，根据传进来的路由登录后跳转，没传值就条跳主页
      const { redirectTo } = searchFormat(props.location.search)
      // console.log(props, 666);
      props.history.push(redirectTo || '/mine');

    } else if (data.code === 3000) {
      //* 校验失败，弹窗提示
      message.error('用户名或密码错误')
    };
  };
  const onFinishFailed = function (valus) {
    console.log(valus, "验证失败");
  };
  return (
    <div>
      <h1 style={{padding:30,height:150,fontSize:40,borderBottom:'1px solid #cfcfcf',marginBottom:50}}>登录送账号</h1>
      <Form
        {...layout}
        name="basic"
        //* 这里设置的默认值必须和下面的name相同
        initialValues={{ remember: true, name: defaultUsername }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          name="name"
          rules={[{ required: true, message: '用户名不能为空' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '密码不能为空' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>记住密码</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            登录
        </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login;