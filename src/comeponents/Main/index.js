import React from 'react';
import {Route, Redirect, Switch, withRouter } from 'react-router-dom'

// 导入二级页面组件模块
import Mine from '~/Mine'
import Goodslist from '~/GoodsList'
import UserList from '~/UserList'
import OrderList from '~/OrderList'
import Login from '~/Login'
import Reg from '~/Reg'
// 导入公共组件
import Search from '../Search/Search'
import './Main.scss'
let Main= function(props){
    // console.log('Main',props);
    return (
        <div className="app-main">
            <Search>
                
            </Search>

            <Switch>
                {/* 有先后顺序的 */}
                <Route path='/mine' render={props => <Mine {...props} />} />
                <Route path='/goods' render={props => <Goodslist {...props} />} />
                <Route path='/user' render={props => <UserList {...props} />} />
                <Route path='/order' render={props => <OrderList {...props} />} />
                <Route path='/login' render={props => <Login {...props} />} />
                <Route path='/reg' render={props => <Reg {...props} />} />
                {/* <Route path='/iq/:id' component={Iq} /> */}
                <Route path='/notfound' render={() => <div>404</div>} />
                <Redirect from='/' to='/mine' />
                {/* 上面都没匹配就去这里 */}
                <Redirect to='/notfound' />
            </Switch>
     </div>
    )
}
Main=withRouter(Main);
export default Main;