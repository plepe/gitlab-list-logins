#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser

const gitlabListLogins = require('./src/index')

const parser = new ArgumentParser({
  add_help: true,
  description: 'Analyzes the log files for successful and failed logins'
})

parser.add_argument('--path', '-p', {
  help: 'Path where to find Gitlab Rails log files',
  default: '/var/log/gitlab/gitlab-rails'
})

parser.add_argument('--date', '-d', {
  help: 'Filter results for the specified date (format: YYYY-MM-DD)',
  default: null
})

parser.add_argument('--ip', {
  help: 'Filter results for the specified IP address',
  default: null
})

const args = parser.parse_args()

gitlabListLogins(args, (err, result) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  result.forEach(attempt => {
    console.log(attempt.time + '\t' + attempt.remote_ip + '\t' + attempt.username + '\t' + (attempt.success ? 'success' : 'fail'))
  })
})
