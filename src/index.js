const fs = require('fs')
const LokiJS = require('lokijs')
const async = require('async')

const populateDatabase = require('./populateDatabase')

const db = new LokiJS('test.db')

const tables = {
  audit: db.addCollection('audit'),
  production: db.addCollection('production')
}

function init (options, callback) {
  fs.readdir(
    options.path,
    (err, files) => {
      if (err) {
        return callback(err)
      }

      async.each(files, (file, done) => {
        if (file.match(/^audit_json\.log/)) {
          populateDatabase(tables.audit, options.path + '/' + file, done)
        } else if (file.match(/^production_json\.log/)) {
          populateDatabase(tables.production, options.path + '/' + file, done)
        } else {
          done()
        }
      }, callback)
    }
  )
}

function parse (options, callback) {
  const allLoginAttempts = tables.production.find({ path: { $regex: /^\/users\/(auth\/|sign_in)/ }, method: 'POST' })

  const result = allLoginAttempts.map(attempt => {
    const params = {}
    attempt.params.forEach(param => {
      params[param.key] = param.value
    })

    const login = tables.audit.find({ correlation_id: attempt.correlation_id })

    return {
      time: attempt.time,
      remote_ip: attempt.remote_ip,
      username: params.username || params.user.login,
      success: !!login.length
    }
  })

  callback(null, result)
}

module.exports = function (options, callback) {
  init(options, (err) => {
    if (err) {
      return callback(err)
    }

    parse(options, callback)
  })
}
