/** @format */

import { program } from 'commander';
import chalk from 'chalk';
import { error } from '../util/logger';
import Use, { ConfigParams } from '../lib/use';
import { OpsModel } from '../util/paramsUtil';
import paths from '../data/paths';
program
  .usage('<tmp-name>')
  .option('-l, --list', 'show your template list') //列出所有模版
  .option('-c, --check', 'check template') //
  .option('-p,--path <path>', 'output template path')
  .option('-h, --help', 'use template');

class templateUse extends Use {
  constructor() {
    super();
    program.parse(process.argv);
    this.init();
  }
  async init() {
    this.help();
    const config = this.getConfig();
    this.initConfig(config as ConfigParams);
    await this.start();
  }
  getConfig() {
    const tmpName = program.args[0];
    const { check, list, path } = program.opts<OpsModel>();
    if (!list && !path) {
      error('--path options is required');
      this.exit();
    }
    return {
      name: tmpName,
      check,
      list,
      path,
      tempJsonPath: paths.tempLocalJson,
      tempLocalPath: paths.tempLocal,
    };
  }
  print() {
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray(' # use a template'));
    console.log('    $ ww use my-template -c -l -p');
    console.log();
  }
}

new templateUse();
