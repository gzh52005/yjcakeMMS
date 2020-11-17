import React from 'react';
import { withRouter } from 'react-router-dom'
//* 导入一级模块
import Head from './comeponents/Head'
import Nav from './comeponents/Nav'
import Main from './comeponents/Main'
import './App.scss';
let App = function(props) {
  // console.log('App',props);
  return (
    <React.Fragment>
    <div className="header">
    <Head/>
    </div>
    <div className="container">
      <div className="nav">
      <Nav/>
      </div>
    <div className="main">
    <Main/>
    </div>
    </div>
  </React.Fragment>
  );
}
App=withRouter(App);

export default App;
