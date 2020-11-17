import React, { useState, useEffect, useMemo, useCallback, useContext, useReducer } from 'react';
import {context} from '../store'

import {Redirect} from 'react-router-dom'
import request from '@/utils/request'
import {message} from 'antd'

/**
 * 高阶组件
    * 把组件作为参数传入
    * 返回一个新的组件
    
    * 注意：封装高阶组件一定要传递props
* 高阶组件定义方式
    * 定义方式一： 属性代理
    * 定义方式二： 反向继承
        > 一般用于类组件
 */
//* 高阶组件(函数)

export function withUser(InnerComponent){
    // * 注意：封装高阶组件一定要传递props
    //!这里能拿到props,是因为路由渲染的mine变成了这里的OutComponent,所以这里能接收到有对象属性的props，然后传给他的子组件，即假mine的虚拟节点
    return function OutComponent(props){
        let data=localStorage.getItem('currentUser')
        let currentUser
        try {
            currentUser=JSON.parse(data)    
        } catch (error) {
            currentUser=data;
        }
        // *传递props直接扩展出来即可,调用该组件(<子组件/>其实是个函数)的时候，mine的原函数组件就变成这个InnerComponent，也就是原mine的结构，现在的mine就是这个带有返回值的OutComponent
        return <InnerComponent {...props} user={currentUser}/>
    }
}
//*高阶组件 加强版
// export function withStorage(key){
//     return function(InnerComponent){
//         // * 注意：封装高阶组件一定要传递props
//         //!这里能拿到props,是因为路由渲染的mine变成了这里的OutComponent,所以这里能接收到有对象属性的props，然后传给他的子组件，即假mine的虚拟节点
//         return function OutComponent(props){
//             let data=localStorage.getItem(key)
//             try {
//                 data=JSON.parse(data)    
//             } catch (error) {
//                 data=data;
//             }
//             const storage={
//                 [key]:data
//             }
//             // *传递props直接扩展出来即可,调用该组件(<子组件/>其实是个函数)的时候，mine的原函数组件就变成这个InnerComponent，也就是原mine的结构，现在的mine就是这个带有返回值的OutComponent
//             return <InnerComponent {...props} {...storage}/>
//         }
//     }
// }

//*高阶组件 加强版v2.0
export function withStorage(...key){
    // console.log(key); //是一个扩展后的数组
    return function(InnerComponent){
        // * 注意：封装高阶组件一定要传递props
        //!这里能拿到props,是因为路由渲染的mine变成了这里的OutComponent,所以这里能接收到有对象属性的props，然后传给他的子组件，即假mine的虚拟节点
        return function OutComponent(props){
            // //* 获取props上的是否保存密码props.isremember状态属性
            // console.log(props,'高阶组件');
            //* 获取state上的是否保存密码state.remember状态属性
            const {state} = useContext(context)
            // console.log(state,'高阶组件');
            let data={}
            try {
                if (state.remember) {
                    key.forEach(item=>(data[item]=(JSON.parse(localStorage.getItem(item)))))
                }else{
                    key.forEach(item=>(data[item]=(JSON.parse(sessionStorage.getItem(item)))))
                }
            } catch (error) {
                data=data;
            }
            // console.log(data,'高阶组件');
        //! 坑，传递值写错成了this.data，导致组件props获取不到本地存取
            // *传递props直接扩展出来即可,调用该组件(<子组件/>其实是个函数)的时候，mine的原函数组件就变成这个InnerComponent，也就是原mine的结构，现在的mine就是这个带有返回值的OutComponent
            return <InnerComponent {...props} {...data}/>
        }
    }
}


//*拦截器
export function withAuth(InnerComponent){
    @withStorage('currentUser')   //! 等于 ==>> OuterComponent = withUser(OuterComponent)，需要加载器才能编译

        class OuterComponent extends React.Component{
            async componentDidMount(){
                // console.log(this.props,'拦截器');
                const {currentUser} = this.props;
                // 校验token
                if(currentUser){
                    // console.log(currentUser.Authorization,'校验token');
                    const data = await request('/user/verify',{},{
                        headers:{
                            Authorization:currentUser.Authorization
                        }
                    });
                    // console.log('verify=',data);
                    if(data.status === 401){
                        message.error('登录已失效，请重新登录')
                        this.props.history.replace({
                            pathname:'/login',
                            search:'?redirectTo='+this.props.location.pathname
                        })
                    }
                }
            }
            render(){
                const {currentUser} = this.props;
                if(currentUser){
                    return <InnerComponent {...this.props} />
                }else{
                    return <Redirect to={"/login?redirectTo="+this.props.location.pathname} />
                }
            }
        }
    return OuterComponent
};


// redux数据使用高阶组件
export function withRedux(InnerComponent){
    return class OuterComponent extends React.Component{
        state = {
            data:{

            }
        }
        componentDidMount(){
            const data = store.getState();
            this.setState({
                data
            });

            store.subscribe(()=>{
                const data = store.getState();
                this.setState({
                    data
                });
            })
        }
        render(){
            return <InnerComponent {...this.props} storeState={this.state.data} dispatch={store.dispatch} />
        }
    }
};