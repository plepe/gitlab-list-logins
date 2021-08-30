#!/usr/bin/env node

const gitlabListLogins = require('./src/index')

gitlabListLogins({}, (err, result) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  result.forEach(attempt => {
    console.log(attempt.time + '\t' + attempt.remote_ip + '\t' + attempt.username + '\t' + (attempt.success ? 'success' : 'fail'))
  })
})
