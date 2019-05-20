const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const utils = require('../utils')
const templatePath = path.resolve(__dirname, '../../template')
module.exports = async function () {
  const projectPath = path.resolve(process.cwd())
  const deployFile = path.resolve(projectPath, 'deploy.config.js')
  console.log(chalk.blue(`begin init in: ${deployFile}`))
  await utils.readWriteFile(path.resolve(templatePath, 'init.template.js'), path.resolve(deployFile))
  console.log(chalk.blue(`init success`))
}
