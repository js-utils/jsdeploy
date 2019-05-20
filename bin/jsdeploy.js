#!/usr/bin/env node
const commander = require('commander')
const program = new commander.Command()
const pkg = require('../package.json')
// version
program.version(pkg.version, '-v, --version')
// init
program
  .command('init')
  .description('run init commands')
  .action(require('./actions/init'));

program.parse(process.argv)
