exports.isFunctionAsync = function (fn) {
  return fn[Symbol.toStringTag] === 'AsyncFunction'
}
