#!/usr/bin/env node
const commander = require('commander')
const program = new commander.Command()
const pkg = require('../package.json')
// version
program.version(pkg.version, '-v, --version')
// init
program.command('init').description('init deploy config').action(require('./actions/init'));
// setup
program.command('setup').description('config deploy servers')
  .option('-e, --env <env>', 'environment', '')
  .action(require('./actions/setup'));
// setup
program.command('build').description('build code')
  .option('-e, --env <env>', 'environment', '')
  .action(require('./actions/build'));
// deploy
program.command('deploy').description('config deploy servers')
  .option('-e, --env <env>', 'environment', '')
  .action(require('./actions/deploy'));

program.parse(process.argv)
