/** @format */

import { program } from 'commander';
import path from 'path';
import chalk from 'chalk';
import Init from '../lib/init';

program.usage('<project-name> [options]').option('-h, --help', 'init a template for your games');

class templateInit extends Init {
  constructor() {
    super();
    program.parse(process.argv);
    const dirName = this.checkDirName();
    this.initConfig({
      dirName,
      targetDirPath: path.resolve(dirName),
    });
    this.init();
  }
  checkDirName() {
    const dirName = program.args[0];
    if (!dirName) {
      this.print();
      this.exit();
    }
    return dirName;
  }
  print() {
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray('    # create a new project template'));
    console.log('    $ ww init my-project');
    console.log();
    console.log(chalk.gray('    # create a new project straight from a github template'));
  }
  async init() {
    this.help();
    await this.start();
  }
}

new templateInit();
