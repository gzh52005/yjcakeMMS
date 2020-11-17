import React,{useContext,useState,useRef,useEffect} from 'react';
import {context} from '@/store'
import {getUserList} from '../api/userApi'
import { withRouter } from 'react-router-dom'
import { Skeleton,Button,message } from 'antd';

let Mine=(props)=>{
const {state:userData} = useContext(context)
const [file, setfile] = useState('');
const [data,setData] =useState('');
const [isLoading,setisLoading]=useState(false);
let obj={
  name:userData.name
}
//* 发送请求,获取用户信息
useEffect(async () => {
  const p=await getUserList({
    pageSize:1,
    page:1,
    query:JSON.stringify(obj)
  })
  //* 设置在state中
  setData(p.data[0])
},[isLoading])
// 判断是否存在token
const islogin=!!userData.token

//* 跳转方法
const goto = (path) => (
  props.history.push(path)
);

//* 获取图片dom用于本地预览
const imgRef = useRef('')

  //*  点击选择图片后改变图片文件上传的事件
  const  onChange=(e)=>{
    //*  设置传输的图片 文件
    setfile(e.target.files[0])
    var reads= new FileReader();
    let f=e.target.files[0];
    reads.readAsDataURL(f);
    reads.onload=function (e) {
      //*  修改节点src
      imgRef.current.src=this.result
    };
  }
//*  点击上传添加图片发送ajax请求,需要发送用户名
const onSetfile=username=>{
  let formdata = new FormData();
  if (!file) {
    return message.error('上传失败')
  }
  //添加图片
  formdata.append('name', username)
  formdata.append('avatar', file)
  setisLoading(true)
  fetch(`http://47.96.19.159:3006/user/headpic`,{
    method:"POST",
    body:formdata
}).then(async (res)=>{
  let p =await res.json()
          if (p.code==2000) {
            message.success('上传成功')
            setisLoading(false)
          }else if(p.code==3000){
            message.error('上传失败')
          }

})

};
    return (
      islogin?<div className='app-mine' style={{padding:20}}>
       
      {/* 上传头像组 */}
           
            <div style={{display:"flex",alignItems:"center"}}>
            <label htmlFor="file" style={{marginBottom:5,position:"relative",display:"inline-block",width:88,height:88 ,borderRadius:50+"%",backgroundColor:'#ccc',overflow:"hidden"}} >
            <span style={{marginTop:20,display:"inline-block"}}>点击此处添加头像！</span> <img className="img" ref={imgRef} src={data.headPic} style={{position:"absolute",width:100+"%",height:100+"%",fontSize:"20px",left:0,top:0}}  />
              </label>
              <div style={{marginLeft:100}}>
                 <h3>欢迎您<mark>{userData.name}</mark>！</h3>
                <p>拼搏到无能为力，努力到感动自己！</p>
              </div>
            </div>
            <Button  onClick={(e) => {e.preventDefault() 
               return onSetfile(userData.name)}}>确定修改</Button>
           
          <input type="file"  id="file" name="file"  multiple  onChange={(e)=>{e.preventDefault()
              return onChange(e)}} style={{display:"none"}} /> 

       <div className='app-mine-content'  >
            <Skeleton  />
            <Skeleton  />
            <Skeleton  />
       </div>
      </div>:<div>
          <h1 style={{fontSize:50,textAlign:"center"}} >请先登录在进行操作</h1>
          <Button type='link' onClick={()=>goto('login')} style={{fontSize:80}}>点我立即登录!!!</Button>
      </div>
    )
}
Mine=withRouter(Mine);
export default Mine;