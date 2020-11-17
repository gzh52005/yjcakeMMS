import request from '../utils/request'

      // 封装get请求

//* 功能：获取所有面试题
const getGoodsList = function(data={},options={}){
    options.method = 'get';
    // console.log(data,'获取数据');
    return request('/goodslist/list',data,options);
}


//* 功能：查看面试题
const lookGoods =(url,data={},options={}) => {
    options.method = 'get';
    return request(`/iq/${url}`,data,options);
}






request.post = function(url,data={},options={}){
    options.method = 'post';
    options.body = JSON.stringify(data)
    options.headers= new Headers({
        'Content-Type': 'application/json'
    })
    return request(url,data,options);
}

export {
    getGoodsList,
    lookGoods
} ;