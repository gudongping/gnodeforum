import React from "react"
import {BrowserRouter, Route, Redirect} from "react-router-dom"
import TopicList from "../views/topic-list/index"
import TopicDetail from "../views/topic-detail/index"
import Login from "../views/user/login"
import TestApi from "../views/test/api-test"

export default () => (
  <div>
    <Route path="/" exact render={()=><Redirect to="/index" />} />
    <Route path="/index" component={TopicList} />
    <Route path="/user/login" component={Login} />
    <Route path="/detail/:id" component={TopicDetail} />
    <Route path="/test" component={TestApi} />
  </div>
)