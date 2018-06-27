const axios = require('axios');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');
const proxy = require('http-proxy-middleware');
const path = require('path');
const NativeModule = require('module');
const vm = require('vm');

const serverRender = require('./server-render');

const serverConfig = require('../../build/webpack.config.server');

const getTemplate = function() {
  return new Promise((resolve, reject)=>{
    axios.get('http://localhost:9999/public/server.ejs').then(res=>{
      // console.log('res', res.data);
      resolve(res.data);
    }).catch(reject);
  })
}

const msf = new MemoryFs();
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = msf

let bundle, createStoreMap

serverCompiler.watch({},(err, stats)=>{
  if(err) throw err;
  stats = stats.toJson();
  stats.errors.forEach(err=>console.log(err));
  stats.warnings.forEach(warning=>console.log(warning));
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  );

  const bundleStr = msf.readFileSync(bundlePath,"utf8");

  try {
    const m = {
      exports:{}
    }
    const wrapper = NativeModule.wrap(bundleStr);
    const script = new vm.Script(wrapper, {
      filename:'server-entry.js',
      displayErrors: true
    })
    const result = script.runInThisContext();
    result.call(null,m.exports, require,m);
    // bundle = m.exports.default;
    // createStoreMap = m.exports.createStoreMap
    bundle = m.exports;
  } catch(err) {
    console.log('compile js error',err);
  }

  console.log('new bundle generated');
})


module.exports = function(app) {
  app.use('/public', proxy({
    target:'http://localhost:9999'
  }));

  app.get('*', function(req, res,next) {
    if(!bundle) {
      return res.send('waiting...');
    }

    getTemplate().then(template=>{
      serverRender(bundle, template, req, res);
    }).catch(next);
  });
}