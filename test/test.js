const co = require('co');
/* async function f() {
  return await 'hello world';
}
f().then(d=>console.log(d)); */

/* async function f() {
  throw new Error(123);
  return await Promise.resolve(123)
}

f()
.then(v => console.log(v))
.catch(e => console.log(e)) */

/* async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v)) */

/* async function f() {
  await Promise.all([1,2])
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v),e=>console.log(e)) */
co(function* () {
  var result = yield Promise.resolve(123);
  return result;
}).then(function (value) {
  console.log(value);
}, function (err) {
  console.error(err.stack);
});