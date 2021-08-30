const lineReader = require('line-reader')

module.exports = function populateDatabase (table, file, callback) {
  lineReader.eachLine(
    file,
    line => table.insert(JSON.parse(line)),
    callback
  )
}
