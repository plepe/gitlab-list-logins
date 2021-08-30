const fs = require('fs')
const LokiJS = require('lokijs')
const async = require('async')

const populateDatabase = require('./populateDatabase')

const db = new LokiJS('test.db')

const tables = {
  audit: db.addCollection('audit'),
  production: db.addCollection('production')
}

// const path = '/var/log/gitlab/gitlab-rails/'
const path = '/tmp/'

function init (callback) {
  fs.readdir(
    path,
    (err, files) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }

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
  const allLoginAttempts = tables.production.find({ path: { $regex: /^\/users\/(auth\/|sign_in)/ }, method: 'POST' })

  allLoginAttempts.forEach(attempt => {
    const params = {}
    attempt.params.forEach(param => {
      params[param.key] = param.value
    })

    const login = tables.audit.find({ correlation_id: attempt.correlation_id })

    console.log(attempt.time + '\t' + attempt.remote_ip + '\t' + (params.username || params.user.login) + '\t' + (login.length ? 'success' : 'fail'))
  })
})
