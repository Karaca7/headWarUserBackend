const crypto = require('crypto')

const salt = 'warHead'

exports.passwordHassing = function (password) {
  const pass = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return pass
}

exports.verifyAuth = function (pass, dbPass) {
  return pass == dbPass
}
