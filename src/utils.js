const fastSafeStringify = require('fast-safe-stringify')

function replacer (_, value) {
  if (value === '[Circular]') {
    return
  }

  return value
}

function safeStringify (value) {
  return fastSafeStringify(value, replacer)
}
module.exports = safeStringify
