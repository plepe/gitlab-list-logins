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
  async.parallel([
    done => populateDatabase(tables.audit, path + '/audit_json.log', done),
    done => populateDatabase(tables.production, path + '/production_json.log', done)
  ], callback)
}

init(() => {
  console.log(tables.audit.find())
})
