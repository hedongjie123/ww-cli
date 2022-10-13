/** @format */

import { program } from 'commander';
import chalk from 'chalk';
import { error } from '../util/logger';
import Modify, { ModifyConfigParams } from '../lib/modify';
import { getTmpFileOptions } from '../util/paramsUtil';
program
  .usage('<tmp-name>')
  .option('-c, --config <config>', 'modify template config')
  .option('-d, --doc <doc>', 'modify a template document')
  .option('-p, --path <path>', 'modify a template ')
  .option('-n, --name <name>', 'modify a template for your local repository')
  .option('-h, --help', 'modify a template for your local repository');

class templateModify extends Modify {
  constructor() {
    super();
    program.parse(process.argv);
    this.init();
  }
  async init() {
    this.help();
    const config = this.initParams();
    this.initConfig(config);
    await this.start();
  }
  initParams(): ModifyConfigParams {
    const tmpName = program.args[0];
    if (!tmpName?.trim()) {
      error('must input modify template name!');
      this.exit();
    }
    const config = getTmpFileOptions();
    if (!config) {
      error('--path options is required');
      this.exit();
    }
    return {
      ...config,
      modifyName: tmpName,
    } as ModifyConfigParams;
  }
  print() {
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray('    # modify a local template'));
    console.log(
      '    $ ww modify my-template --config demo.json --doc my template --path filePath ',
    );
    console.log();
  }
}

new templateModify();
