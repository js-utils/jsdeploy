const chalk = require('chalk')
const fs = require('fs')
const fse = require('fs-extra')
const tools = require('../tools')
const shell = require('shelljs');
module.exports = async function (cmd) {
  const deployConfig = tools.deployConfig
  if (!cmd.env || !deployConfig[cmd.env]) {
    console.log(chalk.red(`Please ensure your deploy env is effective eg: jsdeploy build -e staging`))
    shell.exit(1);
    return
  }
  // 移除打包文件
  fse.removeSync(tools.archiveBuildPath)

  const envConfig = deployConfig[cmd.env]
  const installCommand = envConfig['installCommand'] || deployConfig['default']['installCommand'] || "npm install"
  const buildCommands = envConfig['buildCommands'] || deployConfig['default']['buildCommands'] || []
  console.log(buildCommands)

  console.log(`--- Empty folder: ${tools.projectSourcePath} ---`)
  fse.emptyDirSync(tools.projectSourcePath)

  shell.cd(tools.projectSourcePath);
  console.log(chalk.blue(`--- Clone code ---`))
  if (shell.exec(`git clone -b ${deployConfig[cmd.env]['branch']} ${deployConfig['default']['repositoryUrl']} ./`).code !== 0) {
    shell.echo('Error: Git commit failed')
    shell.exit(1);
    return
  }

  console.log(`--- Clone code to ${tools.projectSourcePath} success`)
  console.log(chalk.green(`=== git branch: ${deployConfig[cmd.env]['branch']} ===`))

  // 软连接 到 共享文件夹
  let sharedDirs = deployConfig['default']['shared']['dirs']
  if (Array.isArray(sharedDirs)) {
    for (let folderName of sharedDirs) {
      let folderPath = tools.resolve(tools.projectSharedPath, folderName)
      console.log(`create soft link ${tools.resolve(tools.projectSourcePath, folderName)} -> ${folderPath}`)
      fse.ensureSymlinkSync(folderPath, tools.resolve(tools.projectSourcePath, folderName))
    }
  }
  // 软连接 到 共享文件
  let sharedFiles = deployConfig['default']['shared']['files']
  if (Array.isArray(sharedFiles)) {
    for (let fileName of sharedFiles) {
      let filePath = tools.resolve(tools.projectSharedPath, fileName)
      console.log(`Create soft link ${tools.resolve(tools.projectSourcePath, fileName)} -> ${filePath}`)
      fse.ensureSymlinkSync(filePath, tools.resolve(tools.projectSourcePath, fileName))
    }
  }

  console.log(chalk.blue(`Run installCommand: ${installCommand}`))
  if (shell.exec(`${installCommand}`).code !== 0) {
    shell.echo(`Run: ${command} Error`)
    shell.exit(1);
    return
  } else { // 成功
    if (sharedDirs.indexOf('node_modules') !== -1) {
      // 移除node_modules软连接
      shell.echo(`--- remove node_modules soft link`)
      fse.removeSync(tools.resolve(tools.projectSourcePath, 'node_modules'))
      // 拷贝node_modules文件到项目目录
      shell.echo(`--- copy share node_modules to project`)
      fse.copySync(tools.resolve(tools.projectSharedPath, 'node_modules'), tools.resolve(tools.projectSourcePath, 'node_modules'))
    }
  }

  console.log(chalk.blue(`--- Begin Build ---`))
  shell.cd(tools.projectSourcePath);
  for (let command of buildCommands) {
    console.log(chalk.blue(`Run buildCommands: ${command}`))
    if (shell.exec(`${command}`).code !== 0) {
      shell.echo(`Run: ${command} Error`)
      shell.exit(1);
      return
    }
  }

  console.log(`--- Archive file to: ${tools.archiveBuildPath} ---`)
  console.log(`command: cd ${tools.archiveRootPath}`)
  shell.cd(tools.archiveRootPath);
  let archiveCommand = `tar -zcvf ${tools.archiveBuildPath} ${deployConfig['default']['archive']['only'].join(' ')}`
  console.log(`command: ${archiveCommand}`)
  if (shell.exec(archiveCommand).code !== 0) {
    shell.echo('Error: archive file error')
    shell.exit(1)
    return
  }

  console.log(chalk.blue(`--- Success Build ---`))



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
