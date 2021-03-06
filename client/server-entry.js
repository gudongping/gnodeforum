import React from "react"
import {StaticRouter} from "react-router-dom"
import {Provider, useStaticRendering} from "mobx-react"
import { JssProvider } from 'react-jss'
import { MuiThemeProvider } from 'material-ui/styles'

import App from "./views/App.jsx"
import {createStoreMap} from "./store/store"

// 让mobx在服务端渲染的时候，不会重复数据变化
useStaticRendering(true)

export default (stores, routerContext, sheetsRegistry, generateClassName, theme, url)=>(
<Provider {...stores}>
  <StaticRouter context={routerContext} location={url}>
    <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
        <App />
      </MuiThemeProvider>
    </JssProvider>
  </StaticRouter>
</Provider>
)

export {createStoreMap}