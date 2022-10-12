/** @format */

import { program } from 'commander';
import chalk from 'chalk';
import { error } from '../util/logger';
import Use, { ConfigParams } from '../lib/use';
import { getTmpFileOptions } from '../util/paramsUtil';
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
    this.initConfig(config);
    await this.start();
  }
  getConfig() {
    const config = getTmpFileOptions();
    if (!config) {
      error(`please input path option`);
      this.exit();
    }
    return config as ConfigParams;
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
