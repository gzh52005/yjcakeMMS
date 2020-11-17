import React, { useState,useEffect } from 'react';
import {getGoodsList} from '../api/goodsApi'
import request from '@/utils/request'
import zhCN from 'antd/es/locale/zh_CN';  // 引入中文包
import { Table, ConfigProvider,Input, InputNumber, Popconfirm, Form ,Popover,Button,message,Spin} from 'antd';
import './UserList.scss'
import AddGoods from './AddGoods'

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

const Goodslist = (props) => {

  const [form] = Form.useForm();
  const [data, setData] = useState('');
  const [total, setTotal] = useState('');
  const [pageSize, setPageSize] = useState('');
  const [editingKey, setEditingKey] = useState('');
  const [file, setfile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(false);
  //* 点击添加商品让开关关闭，显示添加输入框
  const [ishiden,changeHiden] = useState(true)
  
  //* 发送请求
  useEffect(async () => {
    setIsLoading(true)
    setIsImgLoading(true)
    const p=await getGoodsList({
      pageSize:6,
      page:props.location.hash.slice(1)*1||1
    })
    //* 设置在state中
    setPageSize(p.pageSize)
    setTotal(p.total)
    setData(p.data)
    setIsLoading(false);
    setIsImgLoading(false)
  },[props.location.hash.slice(1),ishiden])

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
     let p =await request('/goodslist/delgood',{id:record.id},{method:'delete'},"goodslist")
     if (p.flag) {
      message.success('删除成功');
        //* 设置数据的唯一值
    setDelingKey(record._id);
     }
    }
    catch(errInfo){
      message.error('删除失败:', errInfo);
    }

  };

//* 取消事件  
  const cancel = () => {
    setEditingKey('');
  };

//*分页器数据
 const handleTableChange=({current,pageSize,total}, filters, sorter)=>{
  //*  将分页放在地址栏，用于刷新回退
  props.history.push(`/goods#${current}`);
 }


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     设置上传图片局部loading
    //*  点击选择图片后改变图片文件上传的事件
    const  onChange=(e)=>{
      //*  设置传输的图片 文件
      setfile(e.target.files[0])
      // var reads= new FileReader();
      // let f=e.target.files[0];
      // reads.readAsDataURL(f);
      // reads.onload=function (e) {
      //   //*  修改节点src
      //   console.log(imgDom,555);
      //   // this.result
      // };
    }
//*  点击上传添加图片发送ajax请求,需要发送id
  const onSetfile=fileId=>{
  let formdata = new FormData();
  if (!file) {
    return message.error('上传失败')
  }
  //添加图片
  formdata.append('photos', file)
  setIsImgLoading(true)
  fetch(`http://47.96.19.159:3006/goodslist/altergood/${fileId}`,{
    method:"PUT",
    body:formdata
}).then(async (res)=>{
  let p =await res.json()
          if (p.code==2000) {
            message.success('上传成功')
          }else if(p.code==3000){
            message.error('上传失败')
          }
  setIsImgLoading(false)

})

}
  //* 编辑数据并保存，返回新数据
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item._id);
      
      if (index > -1) {
        const item = newData[index];
       
        //* 修改后的数据 row
        // console.log(row,'修改后的数据');
        //* 将修改后的数据添加到该数据覆盖
        newData.splice(index, 1, { ...item, ...row });
        
        //? *********************************** */
        //* 修改内容成功，在这里发起修改后数据的ajax请求
        //? *********************************** */
      
        let formdata = new FormData();
        // formdata.append("name","百香果 supperDog");
        //* 循环判断数据添加发送
        for(let val in row){
          if (val !=='wap_pictures') {
            // console.log(val,row[val]); 
            formdata.append(`${val}`,`${row[val]}`);
          }
        }
        fetch(`http://47.96.19.159:3006/goodslist/altergood/${item.id}`,{
            method:"PUT",
            // headers:{ 'Content-Type':'multipart/form-data'}, //!  巨坑，默认自带，不需要写！！！！！！！！！！！！！！！！！！！！！！！
            body:formdata
        }).then(async (res)=>{

          let p =await res.json()

          if (p.code==2000) {
            message.success('修改成功')
          }else if(p.code==3000){
            message.warning('内容未变更，取消修改')
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
      console.log('Validate Failed:', errInfo);
    }
  }; 
  // var imgDom 
  //   const ccc= (e)=>{
  //     //! 通过事件绑定，获取到img元素
  //     // console.log(e.currentTarget);
  //       imgDom = e.currentTarget.children[0]
  //      console.log(imgDom,666);
  //       console.log(e.target,666);
  //     if (e.target.name==='file') {
  //       // console.log(e.currentTarget.children[0]);
  //     }
  //   }
  const columns = [
    {
      title: '商品图片',
      dataIndex: 'wap_pictures',
      width:120,
      render: (record,recordData) => {
        
        //!!!!!! 解决一次全部图片变化？？？？？？？？？？？？？
          //* 获取选择的图片当前本地预览图节点
     
        if (record) {
          const pop = record.map((item,index)=>{
            return  (
            <img style={{width:100,height:100}} key={index} src={item.wap_picture} />
            )
            })
            return  (<React.Fragment>
                  {/* <div onClick={(e) =>(ccc(e))}> */}
                  <div>
                      <Popover   content={<div style={{display:"flex",justifyContent:"space-around",flexWrap:"wrap"}}>{pop}</div>} title="商品图片" trigger="hover">
                      <img className="img" style={{width:88}}  key={record} src={record[record.length-1].wap_picture} />
                      </Popover>

                      <div >
                        
                          <label htmlFor="file" style={{cursor:"pointer" ,width:88,border:'1px solid #cfcfcf',padding:'4px 0', display:"inline-block",textAlign:"center"}}>选择图片</label><br/>
                          <Button onClick={(e) => {e.preventDefault() 
                                        return onSetfile(recordData.id)}}>点击上传</Button>
                          <input type="file"  id="file"name="file" key={record} multiple  onChange={(e)=>{e.preventDefault() 
                            return onChange(e)}} style={{display:"none"}} />
                      </div>
                      </div>     
                    </React.Fragment>
                      )
        }
        return '无'
      },
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      width:200,
      editable: true,
    },
    {
      title: '商品属性',
      dataIndex: 'specs',
      width:100,
      render: (record) => {
        if (record) {
          const pop = record.map((item,index)=>{
            return (
            <div key={index}>{item.name}￥{item.price}</div>
            )
            })
            return  (
            <Popover content={<div>{pop}</div>} title="商品属性" trigger="hover">
                        <Button style={{padding:2}}  type='primary' ghost ><div>{record[0].name}￥{record[0].price}</div></Button>
                      </Popover>)
        }
        return '无'
      },
    },
    {
      title: '热门状态',
      dataIndex: 'hot',
      width:95,
      align:'center',
      editable: true,
      render:(record)=> {
        return (
          record*1?"是":"否"
        )
      }
     
    },
    {
      title: '商品类别',
      dataIndex: 'sort',
      width:95,
      align:'center',
      editable: true,
      sorter: (a, b) => b.sort*1 - a.sort*1,
    },
    {
      title: '推荐状态',
      dataIndex: 'recommend',
      width:95,
      align:'center',
      editable: true,
      render:(record)=> {
        return (
          record*1?"是":"否"
        )
      },
    },
    {
      title: '商品编号',
      dataIndex: 'product_number',
      width:95,
      align:'center',
      editable: true,
    },
    {
      title: '编辑商品',
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
      title: '删除商品',
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
    
    <AddGoods ishiden={ishiden}></AddGoods>
    <Button style={{margin:10}} onClick={()=>changeHiden(false)} type="primary">添加商品</Button>
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

export default Goodslist;