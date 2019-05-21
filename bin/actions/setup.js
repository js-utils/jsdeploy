const chalk = require('chalk')
const fs = require('fs')
const fse = require('fs-extra')
const shell = require('shelljs');
const tools = require('../tools')
module.exports = async function (cmd) {
  const deployConfig = tools.deployConfig
  if (!cmd.env || !deployConfig[cmd.env]) {
    console.log('Please ensure your deploy env is effective')
    shell.exit(1);
    return
  }

  // Local Config
  console.log('Local Config')
  fse.mkdirpSync(tools.projectSourcePath)

  // 创建共享文件夹
  let sharedDirs = deployConfig['default']['shared']['dirs']
  if (Array.isArray(sharedDirs)) {
    for (let folderName of sharedDirs) {
      let folderPath = tools.resolve(tools.projectSharedPath, folderName)
      if (!fs.existsSync(folderPath)) {
        console.log(`Create folder ${folderPath}`)
        fse.mkdirpSync(folderPath)
        // console.log(`create soft link ${tools.resolve(tools.projectSourcePath, folderName)} -> ${folderPath}`)
        // fse.ensureSymlinkSync(folderPath, tools.resolve(tools.projectSourcePath, folderName))
      }
    }
  }
  // 创建共享文件
  let sharedFiles = deployConfig['default']['shared']['files']
  if (Array.isArray(sharedFiles)) {
    for (let fileName of sharedFiles) {
      let filePath = tools.resolve(tools.projectSharedPath, fileName)
      if (!fs.existsSync(fileName)) {
        console.log(`Create file: ${filePath}`)
        fse.outputFileSync(filePath, '')
        // console.log(`Create soft link ${tools.resolve(tools.projectSourcePath, fileName)} -> ${filePath}`)
        // fse.ensureSymlinkSync(filePath, tools.resolve(tools.projectSourcePath, fileName))
        console.log(`=== Please config the share file: ${filePath} ===`)
      }

    }
  }


  // Server Config
  console.log('Server Config')
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
