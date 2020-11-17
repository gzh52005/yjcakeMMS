import React,{useState} from 'react';
import CryptoJS from 'crypto-js';
import { Form, Input, Button} from 'antd';
import request from '@/utils/request'
import "./Reg.scss"
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 6 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 6 },
};

const rules = {
    username: [
        { required: true, message: '用户名不能为空' },
        // 自定义校验规则：对象
        {
            validator: function (rule, value) {
                return new Promise((resolve, reject) => {
                    request('/user/checkname', {
                        name: value
                    }).then(res => {
                        if (!res.flag) {
                            reject('用户名已存在')
                        } else if (res.flag) {
                            resolve()
                        }
                    })

                })
            },
            // validateTrigger:'change'
        }
    ],
    password: [
        { required: true, message: '密码不能为空' },
        { min: 6, max: 12, message: '密码必须为6-12个字符' },
    ],
    confirmPassword: [
        { required: true, message: '密码不能为空' },

        // 自定义校验规则：函数
        function (form) {
            return {
                validator: function (rule, value) {
                    if (value !== form.getFieldValue('password')) {
                        return Promise.reject('两次输入密码不一致')
                    }
                    return Promise.resolve();
                }
            }
        }
    ]
}

function Reg(props) {
  
    //* 验证成功，发送请求添加账号到数据库
    const onFinish = async function (values) {
        console.log(values,"验证通过");
        let { username, password}=values
        console.log(username, password,'加密前');
        //* 利用SHA256加密后传送，这样请求头是看不到真正的密码
         password=CryptoJS.SHA256(password).toString()
        // localStorage.setItem('username', JSON.stringify(username))
        console.log(password,'加密后');
         //* 注册
         const data = await request('/user/reg',{
            ...values,
            name:username,
            password,
            headPic:''
        },{method:'post'});
        // 注册成功带值跳转到登录页
        if(data.code === 2000){
            props.history.replace({
                pathname:'/login',
                state:{
                    username
                }
            })
        }
    }
    //* 验证失败
    const onFinishFailed = function (values) {
        console.log(values);
    }
    return (
        <div>
            <h1 style={{padding:30,height:150,fontSize:40,borderBottom:'1px solid #cfcfcf',marginBottom:50}}>免费注册</h1>
            <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                

                <Form.Item
                    label="用户名"
                    name="username"
                    rules={rules.username}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="昵称"
                    name="trueName"
                    rules={rules.username}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="性别"
                    name="sex"
                    rules={[
                        {
                          pattern:/^["男""女"]$/,
                          required: true,
                          message: '只能输入男或女'
                        },
                      ]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="住址"
                    name="address"
                    rules={[{ required: true, message: '请输入现住址!' }]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[{ required: true, message: '请输入邮箱!' }]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="手机号"
                    name="phone"
                    rules={[{ required: true, message: '请输入手机号!' }]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={rules.password}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="确认密码"
                    name="confirmPassword"
                    rules={rules.confirmPassword}
                >
                    <Input.Password />
                </Form.Item>
              

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        注册
        </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Reg;