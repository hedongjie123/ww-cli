/** @format */

import { program } from 'commander';
import Helper from '../pub/helper';
import chalk from 'chalk';
import { error } from '../util/logger';
import fs from 'fs';
import paths from '../data/paths';
import { localTemps } from '../inquirers/localTempsInquirers';
import pathUtil from 'path';

program
  .usage('<tmp-name>')
  .option('-c, --check', 'check template')
  .option('-h, --help', 'remove a template for your local repository');

interface OpsModel {
  check?: boolean;
  name?: string;
}
interface TempItemModel {
  doc?: string;
  fileName?: string;
  name: string;
}
class templateRemove extends Helper {
  tempConfig: Record<string, any> = {};
  constructor() {
    super();
    program.parse(process.argv);
    this.init();
  }
  async init() {
    this.help();
    this.readTempConfig();
    await this.rmControl();
  }
  private readTempConfig() {
    const tempConfigStr = fs.readFileSync(paths.tempLocalJson).toString();
    this.tempConfig = JSON.parse(tempConfigStr);
  }
  async rmControl() {
    const { name = '', check } = this.getOptions();
    let tempItemConfig: TempItemModel = {
      name,
    };
    if (name) {
      tempItemConfig = this.nameRemove(name);
    } else if (check) {
      tempItemConfig = await localTemps(this.tempConfig);
    }
    this.removeTemp(tempItemConfig);
  }

  nameRemove(name: string) {
    const tempItem = this.tempConfig[name];
    if (!tempItem) {
      error(`not find template ${name} !`);
      this.exit();
      return;
    }
    return tempItem;
  } //模版名称删除
  removeTemp(tempItemConfig: TempItemModel) {
    const { fileName, name } = tempItemConfig;
    const ext = pathUtil.extname(fileName || '');
    Reflect.deleteProperty(this.tempConfig, name);
    const newWWJson = JSON.stringify(this.tempConfig);
    fs.writeFileSync(paths.tempLocalJson, newWWJson);
    fs.unlinkSync(pathUtil.join(paths.tempLocal, name + ext));
  }
  getOptions(): OpsModel {
    const name = program.args[0]?.trim();
    const { check } = program.opts<OpsModel>();
    const relName = name?.trim();
    if (!relName && !check) {
      error('must required template name or --check');
      this.exit();
    }
    return {
      name: relName,
      check,
    };
  }
  print() {
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray('    # remove a template for your local repository'));
    console.log('    $ ww rm my-template -c');
    console.log();
  }
}
new templateRemove();
