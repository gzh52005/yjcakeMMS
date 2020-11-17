//* 判断当前环境是否为生产环境，切换不同的接口地址
const baseUrl=process.env.NODE_ENV ==='development'? 'http://47.96.19.159:3006' : 'http://offer.qfh5.cn';
const apiUrl=baseUrl  //! http://120.76.247.5:2001/api

//*三个参数 url 接口参数  data其他查询条件  options请求方法
 function request(url,data={},options={},body){
    //  console.log(url,"总接口");
             //* /iq,  {total: false}total: false,  __proto__: Object {method: "get"}
    //  console.log(...arguments,"接口参数集合");
    url=apiUrl+url //! http://120.76.247.5:2001/user

    //*判断传进来对象的数据的method是不是get方法
    if (options.method==='get'||options.method===undefined||(options.method==='delete'&&body=="goodslist")) {
        if (data) {
            const params=[];
            for(let key in data){
                params.push(`${key}=${data[key]}`)
            }
            // 这样就没有&符号
            console.log(params);
            url = url + '?' + params.join('&')
            // console.log(url,666);
        }
    }else if (options.method==='post'||options.method==='put'||options.method==='delete') {
        // console.log(url,"post请求");
    // options.method = 'post';
    
    options.body = JSON.stringify(data)
        options.headers= new Headers({
            'Content-Type': 'application/json'
        })
    // console.log(options,"post请求");
    
    // if (body=='formdata') {
    //     options.body = queryString.stringify(data)
    //     options.headers= new Headers({
    //         'Content-Type': 'multipart/form-data'
    //     })
    //     console.log(options);
    // }else{
    //     options.body = JSON.stringify(data)
    //     options.headers= new Headers({
    //         'Content-Type': 'application/json'
    //     })
    // }
    }
    console.log(url,'api');
    //! 通过原生js的 fetch方法 发送请求fetch(请求路径,{参数用对象形式})返回的是promise对象
    return fetch(url,{
        ...options
    }).then(res=>{
        return res.json()
    })
}
request.post = function(url,data={},options={}){
    console.log(url,"路由传参");
    options.method = 'post';
    options.body = JSON.stringify(data)
    options.headers= new Headers({
        'Content-Type': 'application/json'
    })
    return request(url,data,options);
}
export default request;