const chalk = require('chalk')
const fse = require('fs-extra')
const tools = require('../tools')
const shell = require('shelljs');
module.exports = async function (cmd) {
  const deployConfig = tools.deployConfig
  if (!cmd.env || !deployConfig[cmd.env]) {
    console.log('Please ensure your deploy env is effective')
    shell.exit(1);
    return
  }

  let sshGroup = new tools.SshGroup(deployConfig[cmd.env]['servers'])
  await sshGroup.connect()
  let deployTo = deployConfig['default']['deployTo']

  console.log('local', tools.archiveBuildPath, tools.resolve(deployTo, 'tmp', 'build.tar.gz'))

  await sshGroup.putFile(tools.archiveBuildPath, tools.resolve(deployTo, 'tmp', 'build.tar.gz'))
  console.log('--- Upload Finished ---')

  await sshGroup.close()


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
