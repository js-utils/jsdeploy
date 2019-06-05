const chalk = require('chalk')
const path = require('path')
const readWriteFile = require('../tools/readWriteFile')
const templatePath = path.resolve(__dirname, '../../template')
module.exports = async function () {
  const cwdPath = path.resolve(process.cwd())
  const deployFile = path.resolve(cwdPath, 'deploy.config.json')

  console.log(chalk.blue(`begin init in: ${deployFile}`))
  readWriteFile(path.resolve(templatePath, 'init.template.json'), path.resolve(deployFile))

  console.log(chalk.blue(`--- Init Success ---`))
}
