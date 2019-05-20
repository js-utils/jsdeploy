const chalk = require('chalk')
const fse = require('fs-extra')
const tmp = require('tmp-promise')
const tools = require('../tools')
module.exports = async function (_, cmd) {
  const deployConfig = tools.deployConfig

  let serverConfig = Object.keys(deployConfig).filter(key => ['default'].indexOf(key) === -1)
  if (cmd.env) {
    serverConfig = serverConfig.filter(key => key === cmd.env )
  }
  console.log(chalk.blue(`will setup server env: ${serverConfig}`))
  for (let key of serverConfig) {
    console.log(chalk.blue(`=== begin setup server env: ${key} ===`))
    let sshGroup = new tools.SshGroup(deployConfig[key]['servers'])
    await sshGroup.connect()
    let deployTo = deployConfig['default']['deployTo']
    // await sshGroup.mkdir(deployTo)
    await sshGroup.mkdir(tools.resolve(deployTo, 'releases'))
    await sshGroup.mkdir(tools.resolve(deployTo, 'tmp'))
    await sshGroup.close()
  }
}
