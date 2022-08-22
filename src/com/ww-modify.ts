/** @format */

import { program } from 'commander';
import TempChangeHelper from '../pub/tempChangeHelper';
import fs from 'fs';
import pathUtil from 'path';
import paths from '../data/paths';
import chalk from 'chalk';
import { error, success } from '../util/logger';

program
  .usage('<tmp-name>')
  .option('-c, --config <config>', 'modify template config')
  .option('-d, --doc <doc>', 'modify a template document')
  .option('-p, --path <path>', 'modify a template ')
  .option('-n, --name <name>', 'modify a template for your local repository')
  .option('-h, --help', 'modify a template for your local repository');

class templateModify extends TempChangeHelper {
  constructor() {
    super();
    program.parse(process.argv);
    this.oldTempName = program.args[0];
    this.init();
  }
  oldTempName: string | undefined;
  async init() {
    this.help();
    this.optionsProvider();
    await this.mkFileControl();
  }
  checkName() {
    if (!this.oldTempName?.trim()) {
      error('must input modify template name!');
      return { nameType: 'exit' };
    }
    if (!this.tempConfig[this.oldTempName]) {
      error('must input a ture template name!');
      return { nameType: 'exit' };
    }
    return { nameType: 'write' };
  }
  writeTempLocalFile(localJson: Record<string, any>, fileName: string, filePath: string) {
    const fileContent = fs.readFileSync(filePath); // 读取文件
    const modifyItemFile = this.tempConfig[this.oldTempName];
    const { fileName: modifyFileName } = modifyItemFile;
    const ext = pathUtil.extname(modifyFileName);
    Reflect.deleteProperty(localJson, this.oldTempName); //删除原有模版
    fs.unlinkSync(pathUtil.join(paths.tempLocal, this.oldTempName + ext));
    fs.writeFileSync(pathUtil.join(paths.tempLocal, fileName), fileContent);
    fs.writeFileSync(paths.tempLocalJson, JSON.stringify(localJson));
  }
  writeTempClear() {
    success('success:modify a template! ');
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
