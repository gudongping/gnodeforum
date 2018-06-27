import React from "react"
import {BrowserRouter, Route, Redirect} from "react-router-dom"
import TopicList from "../views/topic-list/index"
import TopicDetail from "../views/topic-detail/index"
import TestApi from "../views/test/api-test"

export default () => (
  <div>
    <Route path="/" exact render={()=><Redirect to="/list" />} />
    <Route path="/list" component={TopicList} />
    <Route path="/detail" component={TopicDetail} />
    <Route path="/test" component={TestApi} />
  </div>
)