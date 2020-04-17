// Promise finally()
if (typeof Promise.prototype.finally !== 'function') {
  // TIL: on safari ios 11, finally is not undefined, is an object
  // so we must to deleted to implement the polyfill
  // i mean, WTF ?!
  delete Promise.prototype.finally

  require('promise-polyfill/dist/polyfill.min.js')
}

export {}
