const path = require('path')
const readWriteFile = require('./readWriteFile')
const templatePath = path.resolve(__dirname, '../../template')
module.exports = {
  resolve: path.resolve.bind(path),
  templatePath,
  readWriteFile
}
