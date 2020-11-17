import React,{useState,useEffect,useMemo,useCallback} from 'react';

const arr = [];

function UseCallback(){
    const [qty,changeQty] = useState(1);
    const [num,changeNum] = useState(10);

    const handleClick = function(){
        changeQty(qty+1)
    }
    // 用法1：默认用法（不常用，等效于以上用法，每次都会创建一个函数）
    const fn1 = useCallback(function(){
        console.log('用法1：默认用法')
    });

    // 用法2：空依赖（只在初始化时创建函数，组件刷新时从缓存中获取）
    const fn2 = useCallback(function(){
        console.log('用法2：空依赖')
    },[]);

    // 用法3：指定依赖（只在初始化或依赖有修改时创建函数，否则从缓存中获取）
    const fn3 = useCallback(function(){
        console.log('用法3：空依赖')
    },[qty]);

    arr.push(fn3)
    console.log('arr',arr);
    console.log('fn1==fn2',arr[0]===arr[1]);
    
    return (
        <div>
            <h4>useCallback</h4>
            <button onClick={handleClick}>qty:{qty}</button>
            <button onClick={()=>{
                changeNum(num+10)
            }}>num:{num}</button>
        </div>
    )
}

export default UseCallback