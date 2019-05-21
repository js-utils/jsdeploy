const path = require('path')
const fse = require('fs-extra')
const templatePath = path.resolve(__dirname, '../../template')
const cwdPath = path.resolve(process.cwd())
const deployConfigFilePath = path.resolve(process.cwd(), 'deploy.config.json')
const readWriteFile = require('./readWriteFile')
const globalVars = require('./libs/globalVars')
const SshGroup = require('./SshGroup')
const archive = require('./archive')
const deployConfig = fse.readJsonSync(deployConfigFilePath)
const workerspacePath = path.resolve(globalVars.homedir, '.jsdeploy')
const projectName = path.basename(deployConfig['default']['repositoryUrl']).replace('.git', '')
const projectPath = path.resolve(workerspacePath, projectName)
const projectSourcePath = path.resolve(projectPath, 'source')
const projectSharedPath = path.resolve(projectPath, 'shared')
module.exports = {
  resolve: path.resolve.bind(path),
  templatePath,
  cwdPath,
  workerspacePath,
  projectName,
  projectPath,
  projectSourcePath,
  projectSharedPath,
  deployConfigFilePath,
  deployConfig,
  readWriteFile,
  SshGroup,
  archive
}
