import React from 'react';
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Select } from 'antd';

import './Search.scss'

let Search=(props)=>{
    
    // console.log('search',props.location.pathname);
let title='';
switch (props.location.pathname) {
    case '/goods':
        title='商品数据'
        break;
        case '/user':
            title='用户数据'
            break;
            case '/order':
            title='订单数据'
            break;
            case '/cart':
            title='购物车数据'
            break;
}

const { Option } = Select;

const [form] = Form.useForm();

//* 表单改变函数
const  onGenderChange = (value) => {
    console.log(value);
    switch (value) {
        case '蛋糕':
          form.setFieldsValue({ note: '黑森林蛋糕!' });
          return;
        case '马卡龙':
          form.setFieldsValue({ note: '霹雳火马卡龙!' });
          return;
        case '布丁':
          form.setFieldsValue({ note: '坐享脐橙布丁!' });
          return;
      }
};

//*查询函数
const onFinish = (values) => {
    console.log(values,'点击查询');
};

//* 重置函数
const onReset = () => {
    form.resetFields();
};


    return (
        (props.location.pathname=='/login'||props.location.pathname=='/reg'||props.location.pathname=='/mine')?<React.Fragment></React.Fragment>:
        <div className='app-content'>
         {/* 顶部通栏 */}
         <div className='content-top'>{title}</div>
         {/* 顶部搜索按钮 */}
         <div className='content-bar'>
             <Form layout='inline' form={form} name="control-hooks" onFinish={onFinish}>
                 <Form.Item
                     name="note"
                 >
                     <Input style={{width:250}} placeholder="关键字查询" />
                 </Form.Item>
                 <Form.Item
                     name="gender"
                 >
                    <Select
                          placeholder="分类查询"
                          onChange={onGenderChange}
                          style={{width:120}}
                        >
                          <Option value="蛋糕">蛋糕</Option>
                          <Option value="马卡龙">马卡龙</Option>
                          <Option value="布丁">布丁</Option>
                    </Select>
                 </Form.Item>
                
                 <Form.Item >
                     <Button type="primary" htmlType="submit">
                         查询
</Button>
                     <Button htmlType="button" onClick={onReset}>
                         重置
</Button>
                 </Form.Item>
             </Form>
         </div>
        </div>
    )
}
Search=withRouter(Search);
export default Search;