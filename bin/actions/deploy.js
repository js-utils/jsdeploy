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
  let timeStr = Date.current().strftime('%Y%M%d%H%m%s')
  let deployToReleases = tools.resolve(deployTo, 'releases', `${timeStr}`)
  let deployToTmp = tools.resolve(deployTo, 'tmp', `${timeStr}.tar.gz`)

  console.log('local', tools.archiveBuildPath, deployToTmp)

  console.log('--- Begin Upload ---')
  await sshGroup.putFile(tools.archiveBuildPath, deployToTmp)
  console.log('--- Upload Finished ---')

  console.log('--- Begin UnArchive --- ')
  await sshGroup.unArchiveFile(deployToTmp, deployToReleases)
  console.log('--- UnArchive Finished ---')

  console.log('--- Begin soft link --- ')
  await sshGroup.softLink(deployToReleases, tools.resolve(deployTo, 'current'))
  console.log('--- Soft link Finished ---')

  let keepReleases = deployConfig['default']['keepReleases'] || 10
  console.log(`Keep tmp most ${keepReleases}`)
  for (let ssh of sshGroup.connects) {
    // tmp folder
    let tmpCommand = `ls -lt | awk '{if(NR>${keepReleases+1}){print "rm -f "$9}}' | sh`
    console.log(`server ${ ssh.connection.config.host }: ${tmpCommand}`)
    await ssh.execCommand(`${tmpCommand}`, { cwd: tools.resolve(deployTo, 'tmp') }).then(function(result) {
      console.log('STDOUT: ' + result.stdout)
      console.log('STDERR: ' + result.stderr)
    })
    // released folder
    let releasesCommand = `ls -lt | awk '{if(NR>${keepReleases+1}){print "rm -rf "$9}}' | sh`
    console.log(`server ${ ssh.connection.config.host }: ${releasesCommand}`)
    await ssh.execCommand(`${releasesCommand}`, { cwd: tools.resolve(deployTo, 'releases') }).then(function(result) {
      console.log('STDOUT: ' + result.stdout)
      console.log('STDERR: ' + result.stderr)
    })
  }

  console.log('=== Deploy Finished ===')

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
