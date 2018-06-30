const serialize = require('serialize-javascript');
const ejs = require('ejs');
const asyncBootstrap = require('react-async-bootstrapper');
const ReactDomServer = require('react-dom/server');
const Helmet = require('react-helmet').default;

const SheetsRegistry = require('react-jss/lib/jss').SheetsRegistry;
const createMuiTheme = require('material-ui/styles/createMuiTheme').default;
const createGenerateClassName = require('material-ui/styles/createGenerateClassName').default;
const colors = require('material-ui/colors')

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result,storeName)=>{
    result[storeName] = stores[storeName]
    return result;
  },{})
}

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject)=>{
    const createStoreMap = bundle.createStoreMap
    const createApp = bundle.default

    const routerContext = {}
    const stores = createStoreMap()

    const sheetsRegistry = new SheetsRegistry();
    const theme = createMuiTheme({
      palette: {
        primary: colors.pink,
        accent: colors.lightBlue
      }
    })
    const generateClassName = createGenerateClassName();
    const app = createApp(stores,routerContext,sheetsRegistry, generateClassName, theme, req.url)

    asyncBootstrap(app).then(()=>{
      // 检测redirect的情况，一定要在拿到appString后
      if(routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url)
        res.end();
        return;
      }
      const helmet = Helmet.rewind();
      const appString = ReactDomServer.renderToString(app);
      const state = getStoreState(stores)
      console.log('===>state', state);
      console.log('===>appString', appString);
      console.log('===>routerContext',routerContext);
      // res.send(template.replace('<!-- app -->',appString));
      const html = ejs.render(template, {
        appString: appString,
        // initialState: JSON.stringify(state)
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        materialCss: sheetsRegistry.toString()
      })
      res.send(html);
      resolve();
    })
    .catch(reject);
  })
}