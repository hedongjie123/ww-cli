/** @format */

import { program } from 'commander';
import Helper from '../pub/helper';
import chalk from 'chalk';
import { error, success } from '../util/logger';
import fs from 'fs';
import paths from '../data/paths';

program
  .usage('<tmp-name>')
  .option('-l, --list', 'show your template list')
  .option('-c, --check', 'check template')
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
    const { path } = options;
    this.checkPath(path);
    this.writeFile(options);
  }
  async checkControl(options: OpsModel) {
    const { path } = options;
    this.checkPath(path);
  }
  writeFile(options: OpsModel) {
    const { name, path } = options;
  }

  checkPath(path?: string) {
    if (!path) {
      error(`please input path option`);
      this.exit();
      return;
    }
  }
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
