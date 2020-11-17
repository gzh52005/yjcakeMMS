import React, { useState,useEffect,useRef } from 'react';
import {getOrderList} from '../api/orderApi'
import request from '@/utils/request'
import zhCN from 'antd/es/locale/zh_CN';  // 引入中文包
import { Table, ConfigProvider,Input, InputNumber, Popconfirm, Form ,Popover,Button,Spin} from 'antd';
import './UserList.scss'

// @withStorage('currentUser')
// @withAuth 
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `请输入 "${title}"`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const OrderList = (props) => {

  const [form] = Form.useForm();
  const [data, setData] = useState('');
  const [total, setTotal] = useState('');
  const [pageSize, setPageSize] = useState('');
  const [editingKey, setEditingKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  //* 发送请求
  useEffect(async () => {
    setIsLoading(true)
    const p=await getOrderList({
      pageSize:6,
      page:props.location.hash.slice(1)*1||1
    })
    console.log(p.data);
    //* 设置在state中
    setPageSize(p.pageSize)
    setTotal(p.total)
    setData(p.data)
    setIsLoading(false);
  },[props.location.hash.slice(1)])

  //* 设置数据的唯一值
  const isEditing = (record) => record._id === editingKey;

//* 编辑事件
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    //* 设置数据的唯一值
    setEditingKey(record._id);
  };


//* 删除事件   //* 利用数组截取方法静态删除，不会刷新，同时发送ajax删除后台数据
  const del= async(record) => {
    
    const newData1 = [...data];
    const index1 = newData1.findIndex((item) => record._id === item._id);
    newData1.splice(index1, 1);
    setData(newData1);
    setEditingKey('');
    try{
      let query=[]
      query.push(record._id)
      console.log(query);
     let p =await request('/cart/delcart',{_id:query},{method:'delete'})
     console.log(p);
     if (p.flag) {
       console.log('删除成功');
        //* 设置数据的唯一值
    setDelingKey(record._id);
     }
    }
    catch(errInfo){
        console.log('请求失败:', errInfo);
    }
  };

//* 取消事件  
  const cancel = () => {
    setEditingKey('');
  };

//*分页器数据
 const handleTableChange=({current,pageSize,total}, filters, sorter)=>{
  //*  将分页放在地址栏，用于刷新回退
  props.history.push(`/order#${current}`);
 }

//!!!!!! 解决一次全部图片变化？？？？？？？？？？？？？
//* 获取选择的图片当前本地预览图节点
const myRef =useRef()
//*  点击选择图片后改变图片文件上传的事件
 const onChange=(e)=>{
  //*  设置传输的图片 文件
  setfile(e.target.files[0])
  var reads= new FileReader();
   let f=e.target.files[0];
   reads.readAsDataURL(f);
   reads.onload=function (e) {
    //*  修改节点src
    myRef.current.src=this.result
  };

}

  const columns = [
    {
      title: '订单编号',
      dataIndex: '_id',
      width:95,
      align:'center',
    },
    {
      title: '用户名',
      dataIndex: 'name',
      width:95,
      align:'center',
      editable: true,
    },
    {
      title: '购买状态',
      dataIndex: 'albuy',
      width:95,
      align:'center',
      editable: true,
    },
    {
      title: '商品图片',
      dataIndex: ['detailsMsg','0','wap_pictures'],
      align:'center',
      editable: true,
      width:120,
      // editable: true,
      // render: (record) => (<React.Fragment><img src={record} width="100px" alt=""/> <input type="file" name="file" onChange={(e)=>onChange(e)} /></React.Fragment> )
      render: (record,recordData) => {
        if (record) {
          const pop = record.map((item,index)=>{
            return (
            <img style={{width:100,height:100}} key={index} src={item.wap_picture} />
            )
            })
            return  (<React.Fragment>
                      <Popover  content={<div style={{display:"flex",justifyContent:"space-around",flexWrap:"wrap"}}>{pop}</div>} title="商品图片" trigger="hover">
                        <img style={{width:88}} ref={myRef}  key={record[0].id} src={record[record.length-1].wap_picture} />
                      </Popover>
                    </React.Fragment>
                      )
        }
        return '无'
      },
    },
    {
      title: '商品名称',
      dataIndex:  ['detailsMsg','0','name'],
      align:'center',
      width:200,
      editable: true,
    },
    {
      title: '商品属性',
      dataIndex: ['detailsMsg','0','specs'],
      align:'center',
      width:100,
      editable: true,
      render: (record,recordData) => {
        // console.log(record,'record');
        // console.log(recordData,'recordData');
        let specs=''
        if (record) {
          record.forEach((item)=>{
            if (item.id==recordData.specs_id) {
              specs=item
            }
          })

        }
       
        if (specs) {
      //  console.log(specs);
            return  (
              <Button style={{padding:2}}  type='primary' ghost ><div>{specs.name}￥{specs.price}</div></Button>
                      )
        }
        return '暂无规格'
      },
    },
    {
      title: '订单数量',
      dataIndex: 'num',
      width:95,
      align:'center',
      editable: true,
    },
    {
      title: '商品类别',
      dataIndex: ['detailsMsg','0','sort'],
      width:95,
      align:'center',
      editable: true,
      sorter: (a, b) => b.sort*1 - a.sort*1,
    },
   
    {
      title: '编辑订单',
      width:100,
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return (
        editable ? (
          <span>
            <a
              href=""
              onClick={(e) => {e.preventDefault() 
                 return save(record._id)}}
              style={{
                marginRight: 8,
              }}
            >
              保存
            </a>
            <Popconfirm title="确定取消?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <Button type='primary' disabled={editingKey !== ''} onClick={() => edit(record)}>
            编辑
          </Button>
        )
        );
      },
    },
    {
      title: '删除订单',
      width:100,
      dataIndex: 'operation',
      render: (_, record) => {
        return (
          <Button type='primary' danger disabled={editingKey !== ''} onClick={() => del(record)}>
            删除
          </Button>
        )
      },
    },

  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return isLoading?<Spin className="example" tip="Loading..." />:(
    <ConfigProvider locale={zhCN}>
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        rowKey={record => record._id}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
          showQuickJumper:true,
          showSizeChanger:false,
          current:props.location.hash.slice(1)*1||1,
          total:total*1,
          pageSize:pageSize*1
        }}
        onChange={handleTableChange}

        
      />
    </Form>
    </ConfigProvider>)
};

export default OrderList;