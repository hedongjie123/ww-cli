/** @format */

import { program } from 'commander';
import Helper from '../pub/helper';
import chalk from 'chalk';
import { error, success } from '../util/logger';
import fs from 'fs';
import paths from '../data/paths';
import { copyFile, parsePath } from '../util/fsUtil';
import pathUtil from 'path';
import { localTemps } from '../inquirers/localTempsInquirers';
program
  .usage('<tmp-name>')
  .option('-l, --list', 'show your template list') //列出所有模版
  .option('-c, --check', 'check template') //
  .option('-p,--path <path>', 'output template path')
  .option('-h, --help', 'use template');
interface OpsModel {
  check?: boolean;
  list?: boolean;
  path?: string;
  name?: string;
}

class templateUse extends Helper {
  tempConfig: Record<string, any> = {};
  constructor() {
    super();
    program.parse(process.argv);
    this.readTempConfig();
    this.init();
  }
  private readTempConfig() {
    const tempConfigStr = fs.readFileSync(paths.tempLocalJson).toString();
    this.tempConfig = JSON.parse(tempConfigStr);
  }
  async init() {
    this.help();
    await this.useControl();
  }
  async useControl() {
    const options = this.getOptions();
    const { name, check, list } = options;
    if (name) {
      this.useNameControl(options);
      return;
    }
    if (check) {
      await this.checkControl(options);
      return;
    }
    if (list) {
      this.listControl();
      return;
    }
    error(`please input name or check or list option`);
    this.exit();
  }
  listControl() {
    const keys = Object.keys(this.tempConfig);
    if (!keys.length) {
      error('empty templates!');
      return;
    }
    success('templates:');
    keys.forEach((key) => {
      const { doc } = this.tempConfig[key];
      console.log(chalk.gray(`name:${key},doc:${doc}`));
    });
  }
  useNameControl(options: OpsModel) {
    const { path, name } = options;
    this.checkPath(path);
    this.checkInTem(name as string);
    this.writeFile(options);
  }
  checkInTem = (name: string) => {
    if (!this.tempConfig[name]) {
      error(`${name} not find`);
      this.exit();
      return;
    }
  };
  async checkControl(options: OpsModel) {
    const { path } = options;
    this.checkPath(path);
    const { name } = await localTemps(this.tempConfig);
    this.writeFile({ path, name });
  } //选择模式

  writeFile(options: OpsModel) {
    const { name, path } = options;
    const filePath = parsePath(__filename, path) as string;
    const { fileName } = this.tempConfig[name];
    const extname = pathUtil.extname(fileName);
    const ioFileName = name + extname;
    copyFile(pathUtil.join(paths.tempLocal, ioFileName), pathUtil.join(filePath, ioFileName));
    success(`use:${name} template success!`);
  } //生成文件

  checkPath(path?: string) {
    if (!path) {
      error(`please input path option`);
      this.exit();
      return;
    }
  } //检测必填参数
  print() {
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray(' # use a template'));
    console.log('    $ ww use my-template -c -l -p');
    console.log();
  }
  getOptions() {
    const { check, list, path } = program.opts<OpsModel>();
    const name = program.args[0]?.trim();
    return {
      name,
      check,
      list,
      path,
    };
  }
}

new templateUse();
