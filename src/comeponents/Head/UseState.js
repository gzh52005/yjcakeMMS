import React,{useState} from 'react';


function UseState(){
    // useState：返回一个数组[状态,修改状态的方法]
    const [qty,changeQty] = useState(1);
    const [price,changePrice] = useState(100);
    
    return (
        <div>
            <h4>useState</h4>
            <button onClick={()=>{
                changeQty(qty+1)
            }}>qty:{qty}</button>
            <p>价格：{price}</p>
            <input value={price} onChange={(e)=>{
                changePrice(e.currentTarget.value);
            }} />
        </div>
    )
}

export default UseState