const path = require('path')
const fse = require('fs-extra')
const templatePath = path.resolve(__dirname, '../../template')
const projectPath = path.resolve(process.cwd())
const deployConfigFilePath = path.resolve(process.cwd(), 'deploy.config.json')
const readWriteFile = require('./readWriteFile')
const SshGroup = require('./SshGroup')
module.exports = {
  resolve: path.resolve.bind(path),
  templatePath,
  projectPath,
  deployConfigFilePath,
  deployConfig: fse.readJsonSync(deployConfigFilePath),
  readWriteFile,
  SshGroup
}
