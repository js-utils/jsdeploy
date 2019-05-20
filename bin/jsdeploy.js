#!/usr/bin/env node
const commander = require('commander')
const program = new commander.Command()
const pkg = require('../package.json')
// version
program.version(pkg.version, '-v, --version')
// init
program.command('init').description('init deploy config').action(require('./actions/init'));
program.command('setup [env]').description('config deploy servers')
  .option('-e, --env <env>', 'environment', '')
  .action(require('./actions/setup'));

program.parse(process.argv)
