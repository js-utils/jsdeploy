const chalk = require('chalk')
const fse = require('fs-extra')
const tools = require('../tools')
const shell = require('shelljs');
module.exports = async function (_, cmd) {
  const deployConfig = tools.deployConfig
  let serverConfig = Object.keys(deployConfig).filter(key => ['default'].indexOf(key) === -1)

  fse.mkdirpSync(tools.resolve(tools.workerspacePath, 'source'))
  fse.mkdirpSync(tools.resolve(tools.workerspacePath, 'shared'))


  if (shell.exec('git commit -am "Auto-commit"').code !== 0) {
    shell.echo('Error: Git commit failed')
    shell.exit(1);
  }

  // 1. 克隆代码


  // if (cmd.env) {
  //   serverConfig = serverConfig.filter(key => key === cmd.env )
  // }
  // console.log(chalk.blue(`will deploy server env: ${serverConfig}`))
  // for (let key of serverConfig) {
  //   console.log(chalk.blue(`=== begin deploy server env: ${key} ===`))
  //   let sshGroup = new tools.SshGroup(deployConfig[key]['servers'])
  //   await sshGroup.connect()
  //   let deployTo = deployConfig['default']['deployTo']
  //
  //   await sshGroup.close()
  // }
}
