const chalk = require('chalk')
const node_ssh = require('node-ssh')
const globalVars = require('./libs/globalVars')
module.exports = class SshGroup {
  constructor (servers) {
    this.servers = servers
    this.connects = []
  }
  connect () {
    return new Promise((resolve, reject) => {
      for (let server of this.servers) {
        const ssh = new node_ssh()
        ssh.connect(Object.assign({privateKey: `${globalVars.homedir}/.ssh/id_rsa`}, server)).then(() => {
          this.connects.push(ssh)
          if (this.connects.length === this.servers.length) {
            resolve(this.connects)
          }
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }
  async mkdir (remotePath) {
    for (let ssh of this.connects) {
      console.log(chalk.yellow(`server ${ ssh.connection.config.host }: mkdir ${remotePath}`))
      await ssh.mkdir(remotePath)
    }
  }
  async putFile (localFile, remoteFile) {
    for (let ssh of this.connects) {
      console.log(chalk.yellow(`server ${ ssh.connection.config.host }: putFile ${remoteFile}`))
      await ssh.putFiles([{ local: localFile, remote: remoteFile }])
    }
  }
  async unArchiveFile (remoteFile, toPath) {
    let unArchiveCommand = `tar -zxvf ${remoteFile} -C ${toPath}`
    for (let ssh of this.connects) {
      console.log(chalk.yellow(`server ${ ssh.connection.config.host }: unArchive ${remoteFile} to ${toPath}`))
      console.log(chalk.yellow(`command: ${unArchiveCommand}`))
      await ssh.execCommand(`mkdir ${toPath}`)
      await ssh.execCommand(`${unArchiveCommand}`)
    }
  }
  async softLink (realPath, softLinkPath) {
    let softLinkCommand = `ln -snf ${realPath} ${softLinkPath}`
    for (let ssh of this.connects) {
      console.log(chalk.yellow(`server ${ ssh.connection.config.host }: ${softLinkCommand}`))
      await ssh.execCommand(`${softLinkCommand}`)
    }
  }
  async close () {
    for (let ssh of this.connects) {
      await ssh.connection.end()
      console.log(`server ${ ssh.connection.config.host } end & exit`)
    }
  }
}
