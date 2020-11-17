import React,{useState,useEffect} from 'react';


function UseEffect(){
    const [qty,changeQty] = useState(1);
    const [num,changeNum] = useState(10);

    // 用法1：默认用法（等效于componentDidMount+componentDidUpdate）
    useEffect(function(){
        // 这里的代码在初始化和组件刷新时执行
        console.log('用法1：默认用法')
    })

    // 用法2：添加依赖（等效于shouldComponentUpdate）
    useEffect(function(){
        // 这里的代码在初始化和qty有修改时执行这里的代码
        console.log('用法2：依赖qty')
    },[qty])

    // 用法3：空依赖（等效于componentDidUpdate）
    useEffect(function(){
        // 这里的代码只有初始化时执行
        console.log('用法3：空依赖')
    },[])

    // 用法4：返回一个函数（等效于componentWillUnmount）
    useEffect(function(){
        // 发起ajax
       return function(){
           // 这里的代码在组件销毁后执行
           console.log('用法4：返回一个函数')
           // 取消ajax
       }
    })
    
    return (
        <div>
            <h4>useEffect</h4>
            <button onClick={()=>{
                changeQty(qty+1)
            }}>qty:{qty}</button>
            <button onClick={()=>{
                changeNum(num+10)
            }}>num:{num}</button>
        </div>
    )
}

export default UseEffect