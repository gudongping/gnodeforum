import React from "react"
import {BrowserRouter, Route, Redirect, withRouter} from "react-router-dom"
import TopicList from "../views/topic-list/index"
import TopicDetail from "../views/topic-detail/index"
import TopicCreate from '../views/topic-create/index'
import Login from "../views/user/login"
import Info from '../views/user/info'
import TestApi from "../views/test/api-test"
import {inject, observer} from 'mobx-react'
import PropTypes from 'prop-types'

const ProtectedRoute = ({isLogin, user, component: Component, ...rest })=> {
  // console.log('isLogin', isLogin);
  // console.log('user', user)
  // console.log('user.info', user.info)
  return (
    <Route
      {...rest}
      render = {
        (props) =>
        isLogin ?
        <Component {...props}/> :
        <Redirect to={{
          pathname:'/user/login',
          search: `?from=${rest.path}`
        }}/>
      }
    />
  )
}


ProtectedRoute.propTypes = {
  isLogin: PropTypes.bool,
  component: PropTypes.func.isRequired
}

ProtectedRoute.defaultProps = {
  isLogin: false
}

const InjectedProtectedRoute = withRouter(inject(stores=>{
  return {
    isLogin: stores.appState.user.isLogin,
    appState: stores.appState,
    user: stores.appState.user
  }
})(observer(ProtectedRoute)))

export default () => (
  <div>
    <Route path="/" exact render={()=><Redirect to="/index" />} />
    <Route path="/index" component={TopicList} />
    <Route path="/user/login" component={Login} />
    <Route path="/detail/:id" component={TopicDetail} />
    <Route path="/test" component={TestApi} />
    <InjectedProtectedRoute path="/user/info" component={Info} />
    <InjectedProtectedRoute path="/topic/create" component={TopicCreate}/>
  </div>
)