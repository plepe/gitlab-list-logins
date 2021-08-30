#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser

const gitlabListLogins = require('./src/index')

const parser = new ArgumentParser({
  add_help: true,
  description: 'Analyzes the log files for successful and failed logins'
})

const args = parser.parse_args()

gitlabListLogins({}, (err, result) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  result.forEach(attempt => {
    console.log(attempt.time + '\t' + attempt.remote_ip + '\t' + attempt.username + '\t' + (attempt.success ? 'success' : 'fail'))
  })
})
