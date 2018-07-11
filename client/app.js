import React from "react"
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom';
import {Provider} from "mobx-react"
import {MuiThemeProvider, createMuiTheme} from "material-ui/styles"
import {lightBlue,pink} from "material-ui/colors"

import App from './views/App.jsx'
import {AppState, TopicStore} from './store/store';

const theme = createMuiTheme({
  palette: {
    primary: pink,
    accent: lightBlue
  }
})

// const initialState = window.__INITIAL_STATE__ ? JSON.parse(window.__INITIAL_STATE__) : {};
const initialState = window.__INITIAL_STATE__ || {};


const createApp = (TheApp)=> {
  class Main extends React.Component {
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return <TheApp />
    }
  }
  return Main
}

const appState = new AppState(initialState.appState)
const topicStore = new TopicStore(initialState.topicStore)

const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider appState={appState} topicStore={topicStore}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Component />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
}

render(createApp(App));

if(module.hot) {
  module.hot.accept();
}