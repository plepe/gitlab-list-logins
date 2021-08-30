const fs = require('fs')
const loki = require('lokijs')
const async = require('async')

const populateDatabase = require('./populateDatabase')

const db = new loki('test.db')

const tables = {
  audit: db.addCollection('audit'),
  production: db.addCollection('production')
}

const path = '/var/log/gitlab/gitlab-rails/'

function init (callback) {
  fs.readdir(
    path,
    (err, files) => {
      async.each(files, (file, done) => {
        if (file.match(/^audit_json\.log/)) {
          populateDatabase(tables.audit, path + file, done)
        } else if (file.match(/^production_json\.log/)) {
          populateDatabase(tables.production, path + file, done)
        } else {
          done()
        }
      }, callback)
    }
  )
}

init(() => {
  const allLoginAttempts = tables.production.find({path: {'$regex': /^\/users\/auth\//}, method: 'POST'})

  allLoginAttempts.forEach(attempt => {
    let params = {}
    attempt.params.forEach(param => params[param.key] = param.value)

    const login = tables.audit.find({correlation_id: attempt.correlation_id})

    console.log(attempt.time, attempt.remote_ip, params.username, login.length ? 'success' : 'fail')
  })
})
