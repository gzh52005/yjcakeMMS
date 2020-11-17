import React,{useState,useEffect,useMemo} from 'react';


function UseMemo(){
    const [qty,changeQty] = useState(1);
    const [num,changeNum] = useState(10);

    // 用法1：默认用法（不常用）
    const result1 = useMemo(function(){
        console.log('比较耗性能的操作1');
        return 100;
    });
    console.log('result1=',result1)

    // 用法2：空依赖（只在初始化时执行）
    const result2 = useMemo(function(){
        console.log('比较耗性能的操作2');
        return 200;
    },[]);
    console.log('result2=',result2)

    // 用法3：指定依赖（在初始化和依赖有修改时时执行）
    const result3 = useMemo(function(){
        console.log('比较耗性能的操作3');
        return 300*qty;
    },[qty]);
    console.log('result3=',result3)
    
    return (
        <div>
            <h4>useMemo</h4>
            <button onClick={()=>{
                changeQty(qty+1)
            }}>qty:{qty}</button>
            <button onClick={()=>{
                changeNum(num+10)
            }}>num:{num}</button>
        </div>
    )
}

export default UseMemo