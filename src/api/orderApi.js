import request from '../utils/request'

      // 封装get请求

//* 功能：获取所有面试题
const getOrderList = function(data={},options={}){
    options.method = 'get';
    // console.log(data,'获取数据');
    return request('/cart/cartlist',data,options);
}



export {
    getOrderList,
} 