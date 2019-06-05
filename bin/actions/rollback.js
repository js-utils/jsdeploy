const chalk = require('chalk')
const fse = require('fs-extra')
const tools = require('../tools')
const shell = require('shelljs');
module.exports = async function (cmd) {
  const deployConfig = tools.deployConfig
  if (!cmd.env || !deployConfig[cmd.env]) {
    console.log(chalk.red(`Please ensure your deploy env is effective eg: jsdeploy rollback -e staging`))
    shell.exit(1);
    return
  }

  let sshGroup = new tools.SshGroup(deployConfig[cmd.env]['servers'])
  await sshGroup.connect()
  let deployTo = deployConfig['default']['deployTo']
  for (let ssh of sshGroup.connects) {
    // released folder
    let rollbackCommand = `ls -lt . | head -2 | awk '{if(NR>1){print "rm -rf "$9}}' | sh`
    console.log(`server ${ ssh.connection.config.host }: ${rollbackCommand}`)
    await ssh.execCommand(`${rollbackCommand}`, { cwd: tools.resolve(deployTo, 'releases') })
    let softLinkCommand = `ls -lt . | head -2 | awk '{if(NR>1){print "ln -snf ${tools.resolve(deployTo, 'releases')}/"$9" ${tools.resolve(deployTo, 'current')}"}}' | sh`
    console.log(`server ${ ssh.connection.config.host }: ${softLinkCommand}`)
    await ssh.execCommand(`${softLinkCommand}`, { cwd: tools.resolve(deployTo, 'releases') })
  }
  await sshGroup.close()

  console.log(chalk.blue(`---  Rollback Success ---`))



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
