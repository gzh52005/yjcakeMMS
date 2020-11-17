import React, { useState,useEffect } from 'react';
import {getUserList} from '../api/userApi'
import request from '@/utils/request'
import zhCN from 'antd/es/locale/zh_CN';  // 引入中文包
import { Table, ConfigProvider,Input, InputNumber, Popconfirm, Form ,Popover,Button,message,Spin} from 'antd';
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

const Userlist = (props) => {
 
  const [form] = Form.useForm();
  const [data, setData] = useState('');
  const [total, setTotal] = useState('');
  const [pageSize, setPageSize] = useState('');
  const [editingKey, setEditingKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  //* 发送请求
  useEffect(async () => {
    setIsLoading(true)
    const p=await getUserList({
      pageSize:6,
      page:props.location.hash.slice(1)*1||1
    })
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
     let p =await request('/user/deluser',{name:record.name},{method:'delete'})
     console.log(p);
     if (p.flag) {
      message.success('删除成功')
     }
    }
    catch(err){
      message.warning('删除失败')

    }

  };

//* 取消事件  
  const cancel = () => {
    setEditingKey('');
  };

//*分页器数据
 const handleTableChange=({current,pageSize,total}, filters, sorter)=>{
  //*  将分页放在地址栏，用于刷新回退
  props.history.push(`/user#${current}`);
 }

  //* 编辑数据并保存，返回新数据
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
       
        //* 修改后的数据
        // console.log(row);

        //* 将修改后的数据添加到该数据覆盖
        newData.splice(index, 1, { ...item, ...row });

        
        //? *********************************** */
        //* 修改内容成功，在这里发起修改后数据的ajax请求
        //? *********************************** */
        console.log(newData[index].name+"");
        request(`/user/edit/${newData[index].name+""}`,row,{method:'put'}).then(res=>{
          if (res.flag) {
        message.success('修改成功');
          }else{
        message.warning('内容未改变,取消修改');
          }
        })
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      message.error('修改失败:', errInfo);
    }
  };

  const columns = [
    // {
    //   title: '用户头像',
    //   dataIndex: 'headPic',
    //   width:'8%',
    //   render: (record) => <img src={record} width="100px" alt=""/>,
    //   editable: true,
    // },
    {
      title: '昵称',
      dataIndex: 'name',
      width:200,
      editable: true,
    },
    {
      title: '姓名',
      dataIndex: 'trueName',
      width:100,
      editable: true,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width:70,
      editable: true,
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      width:106,
      editable: true,
      sorter: (a, b) => b.birthday.replace(/[^\d]*/g, "") - a.birthday.replace(/[^\d]*/g, ""),
    },
    {
      title: '住址',
      dataIndex: 'address',
      width:200,
      editable: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width:200,
      editable: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      width:120,
      editable: true,
    },
    {
      title:'会员',
      dataIndex:'isVIP',
      width:70,
      editable: true,
      render: (record) => record?'是':'否'
    },
    {
      title: '编辑',
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
                 return save(record.key)}}
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
          <a disabled={editingKey !== ''} onClick={() => edit(record)}>
            编辑
          </a>
        )
        );
      },
    },
    {
      title: '删除',
      width:100,
      dataIndex: 'operation',
      render: (_, record) => {
        return (
          <a disabled={editingKey !== ''} onClick={() => del(record)}>
            删除
          </a>
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
          pageSize:pageSize*1,
        }}
        onChange={handleTableChange}
        
      />
    </Form>
    </ConfigProvider>)
};

export default Userlist;