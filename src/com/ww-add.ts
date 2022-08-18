/** @format */
import { program } from 'commander';
import chalk from 'chalk';
import TempChangeHelper from '../pub/tempChangeHelper';
program
  .usage('<tmp-name>')
  .option('-c, --config <config>', 'add template config') //优先 config文件
  .option('-d, --doc <doc>', 'template document') //模版描述
  .option('-p, --path <path>', 'template file path') //模版路径
  .option('-h, --help', 'add a template for your games');

class templateAdd extends TempChangeHelper {
  constructor() {
    super();
    program.parse(process.argv);
    this.init();
  }
  async init() {
    this.help();
    this.optionsProvider();
    await this.mkFileControl();
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
