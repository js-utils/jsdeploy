const chalk = require('chalk')
const tools = require('../tools')
module.exports = async function () {
  const projectPath = tools.resolve(process.cwd())
  const deployFile = tools.resolve(projectPath, 'deploy.config.json')
  console.log(chalk.blue(`begin init in: ${deployFile}`))
  await tools.readWriteFile(tools.resolve(tools.templatePath, 'init.template.json'), tools.resolve(deployFile))
  console.log(chalk.blue(`init success`))
}
