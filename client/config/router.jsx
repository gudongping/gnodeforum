import React from "react"
import {BrowserRouter, Route, Redirect} from "react-router-dom"
import TopicList from "../views/topic-list/index"
import TopicDetail from "../views/topic-detail/index"
import TopicCreate from '../views/topic-create/index'
import Login from "../views/user/login"
import Info from '../views/user/info'
import TestApi from "../views/test/api-test"

export default () => (
  <div>
    <Route path="/" exact render={()=><Redirect to="/index" />} />
    <Route path="/index" component={TopicList} />
    <Route path="/user/login" component={Login} />
    <Route path="/user/info" component={Info} />
    <Route path="/detail/:id" component={TopicDetail} />
    <Route path="/topic/create" component={TopicCreate} />
    <Route path="/test" component={TestApi} />
  </div>
)