/** @format */

import { program } from 'commander';
import chalk from 'chalk';
import Remove from '../lib/remove';
import paths from '../data/paths';

program.usage('<tmp-name>').option('-h, --help', 'remove a template for your local repository');

class templateRemove extends Remove {
  constructor() {
    super();
    program.parse(process.argv);
    this.init();
  }
  async init() {
    this.help();
    const config = this.getConfig();
    this.initConfig(config);
    this.start();
  }
  getConfig() {
    const tmpName = program.args[0];
    return {
      name: tmpName,
      tempJsonPath: paths.tempLocalJson,
      tempLocalPath: paths.tempLocal,
    };
  }
  print() {
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray('    # remove a template for your local repository'));
    console.log('    $ ww rm my-template');
    console.log();
  }
}
new templateRemove();
