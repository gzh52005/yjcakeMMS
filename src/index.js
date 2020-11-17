import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter,BrowserRouter} from 'react-router-dom'
import './index.scss';
import App from './App';

import {Provider} from './store'
// 上线自动切换历史路由
const Router = process.env.NODE_ENV === 'production' ? BrowserRouter : HashRouter

ReactDOM.render(
  <Provider>
  <Router>
    <App />
  </Router>
  </Provider>
    ,
  document.getElementById('app')
);


