import React from "react"
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import App from './views/App.jsx'
import { BrowserRouter } from 'react-router-dom';
import {Provider} from "mobx-react"
import AppState from './store/app-state';

// import {MuiThemeProvider, createMuiTheme, lightBlue, pink} from "material-ui"
// console.log(MuiThemeProvider, createMuiTheme, lightBlue, pink)

const initialState = window.__INITIAL_STATE__ ? JSON.parse(window.__INITIAL_STATE__) : {};
// const initialState = window.__INITIAL_STATE__ || {};
ReactDOM.render(
  <AppContainer>
    <Provider appState={new AppState(initialState.appState)}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Provider>
  </AppContainer>,
  document.getElementById('root')
);

if(module.hot) {
  module.hot.accept();
}