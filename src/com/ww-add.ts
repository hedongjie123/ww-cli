/** @format */
import { program } from 'commander';
import chalk from 'chalk';
import Add, { ConfigParams } from '../lib/add';
import { getTmpFileOptions } from '../util/paramsUtil';
import { error } from '../util/logger';
program
  .usage('<tmp-name>')
  .option('-c, --config <config>', 'add template config') //优先 config文件
  .option('-d, --doc <doc>', 'template document') //模版描述
  .option('-p, --path <path>', 'template file path') //模版路径
  .option('-h, --help', 'add a template for your games');

class templateAdd extends Add {
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
  initParams(): ConfigParams {
    const config = getTmpFileOptions();
    if (!config) {
      error('--path options is required');
      this.exit();
    }
    return config as ConfigParams;
  }
  print() {
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray('    # add a new local template'));
    console.log('    $ ww add my-template --config demo.json --doc my template --path filePath ');
    console.log();
  }
}

new templateAdd();
