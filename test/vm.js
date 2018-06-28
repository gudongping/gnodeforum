const vm = require('vm');
const util = require('util');
const NativeModule = require('module');
const path = require('path');
const fs = require('fs');

const wrapper = NativeModule.wrap('module.exports = {a:1}; console.log(module.exports)');
const script = new vm.Script(wrapper, {
  filename:'test.js'
});
// console.log('wrapper', wrapper);
var m = {exports: {}}
const result = script.runInThisContext();
console.log('result', result);
result.call(null, m.exports,require,m);
console.log(m.exports);

const Module = module.constructor;
const _m = new Module();
_m._compile('console.log(12345)','test.js');