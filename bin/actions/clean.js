const chalk = require('chalk')
const fse = require('fs-extra')
const tools = require('../tools')
module.exports = async function () {
  console.log(`--- Empty folder: ${tools.projectPath} ---`)
  fse.emptyDirSync(tools.projectPath)
  console.log(chalk.blue(`--- Clean Success ---`))
}
