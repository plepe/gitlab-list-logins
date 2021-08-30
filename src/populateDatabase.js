const fs = require('fs')
const zlib = require('zlib')
const readline = require('readline')

module.exports = function populateDatabase (table, file, callback) {
  let lineReader

  if (file.match(/\.gz$/)) {
    lineReader = readline.createInterface({
      input: fs.createReadStream(file).pipe(zlib.createGunzip())
    })
  } else {
    lineReader = readline.createInterface({
      input: fs.createReadStream(file)
    })
  }

  lineReader.on('line', line => table.insert(JSON.parse(line)))
  lineReader.on('close', callback)
}
