/** @format */

import { program } from 'commander';
import * as gitRepo from '../data/gitRepo';
import download from 'download-git-repo';
import path from 'path';
import * as logger from '../util/logger';
import ora from 'ora';
import { clearDirInquirer, tempTypeInquirer, upCacheDirInquirer } from '../inquirers/initInquirers';
import fs from 'fs';
import { clearDir, copyFile } from '../util/fsUtil';
import chalk from 'chalk';
import Helper from '../pub/helper';
program.usage('<project-name> [options]').option('-h, --help', 'init a template for your games');
enum FileStatus {
  dir,
  file,
  empty,
  notFind,
}
class templateInit extends Helper {
  constructor() {
    super();
    program.parse(process.argv);
    this.init();
  }
  cachePath = path.join(__dirname, '..'); // cli path to save template
  targetPath = path.resolve(); //cmd path to cp template
  cacheDirPath = '';
  targetDirPath = '';
  repo = '';
  async init() {
    this.help();
    const dirName = this.checkDirName();
    const { tempType } = await tempTypeInquirer();
    this.repo = gitRepo[tempType];
    this.cacheDirPath = path.join(this.cachePath, `tmp-${tempType}`);
    this.targetDirPath = path.join(this.targetPath, dirName);
    await this.startControl(tempType);
    const dirStatus = this.checkEmptyDir(this.targetDirPath);
    if (dirStatus === FileStatus.dir) {
      await this.clearTargetDir(dirName);
    } else if (dirStatus !== FileStatus.empty) {
      fs.mkdirSync(this.targetDirPath); //没有则创建一个目录
    }
    copyFile(this.cacheDirPath, this.targetDirPath);
    logger.success('create a new project success');
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
  async startControl(tempType: string) {
    const isUp = await this.clearCacheDir(tempType);
    if (!isUp) {
      return;
    }
    try {
      await this.downloadAsync();
      logger.success('success:downloading template');
    } catch (e) {
      logger.error('fail:downloading template');
      this.exit();
    }
  } //is up cache?

  async clearCacheDir(tempType: string) {
    const dirStatus = this.checkEmptyDir(this.cacheDirPath);
    console.log(dirStatus, 'dirStatus');
    if (dirStatus !== FileStatus.dir) {
      return true;
    }
    const { up } = await upCacheDirInquirer(tempType);
    if (up) {
      clearDir(this.cacheDirPath);
    }
    return up;
  }
  downloadAsync() {
    const spinner = ora('downloading template').start();
    return new Promise((resolve, reject) => {
      download(`direct:${this.repo}`, this.cacheDirPath, { clone: true }, function (err) {
        spinner.stop();
        if (err) {
          return reject(err);
        }
        resolve('success');
      });
    });
  } //clone git repo

  checkEmptyDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      return FileStatus.notFind;
    }
    const stat = fs.lstatSync(dirPath);
    const isDir = stat.isDirectory();
    if (!isDir) {
      return FileStatus.file;
    }
    const dirs = fs.readdirSync(dirPath);
    return !!dirs.length ? FileStatus.dir : FileStatus.empty;
  } //check dir or file

  async clearTargetDir(dirName: string) {
    const dirPath = path.join(this.targetPath, dirName);
    const { clear } = await clearDirInquirer(dirName);
    if (!clear) {
      this.exit();
    }
    clearDir(dirPath);
  } // is clear target dir ?
}

new templateInit();
