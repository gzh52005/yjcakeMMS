import React, { useState,useEffect } from 'react';
import {getGoodsList} from '../api/goodsApi'
import request from '@/utils/request'
import { Form, Input, Button } from 'antd';

const AddGoods=(props)=>{
  
  const [ishiden,changeHiden] = useState(true)

  useEffect(()=>{
    let {ishiden:flag}=props
    if (!flag) {
      changeHiden(false)
    }
  },[props])

    const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
      };

    const validateMessages = {
        required: '${label} 不能为空',
        types: {
          number: '${label} 只能输入数字',
        },
      };
      
      //* 通过后显示的值
    const onFinish = async (values) => {
     let p =await request('/goodslist/addgood',{...values.goods,wap_pictures:''},{method:'post'})
          console.log(p);

      changeHiden(true)
        };

    return (
      ishiden?<React.Fragment></React.Fragment>:
        <div className='addgoods' style={{position:"fixed",zIndex:100,backgroundColor:"rgb(240,240,240)",border:"1px solid",marginLeft:150,padding:50,paddingRight:200}}>
          <Button type="link" style={{position:"absolute",right:20,top:10}} onClick={()=>changeHiden(true)}>关闭</Button>
     <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
      <Form.Item
        name={['goods', 'name']}
        label="商品名称"
        rules={[
          {
            required: true
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name={['goods', 'hot']}
        label="热度"
        rules={[
          {
            pattern:/^[01]$/,
            message: '只能输入0或1'
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name={['goods', 'recommend']}
        label="推荐状态"
        rules={[
          {
            pattern:/^[01]$/,
            message: '只能输入0或1'
          },
        ]}
      >
        <Input/>
      </Form.Item>

      <Form.Item 
      name={['goods', 'product_number']} 
      label="商品编号" 
      rules={[
        {
          required: true
        },
      ]}
      >
        <Input />
      </Form.Item>

      <Form.Item 
      name={['goods', 'sort']} 
      label="商品分类" 
      rules={[
        {
          pattern:/^[0-9]*$/,
          message: '只能输入数字'
        },
      ]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          添加数据
        </Button>
      </Form.Item>
    </Form>
        </div>
    )
}

export default AddGoods