/** @format */

import * as gitRepo from '../data/gitRepo';
import download from 'download-git-repo';
import * as logger from '../util/logger';
import ora from 'ora';
import { clearDirInquirer, tempTypeInquirer, upCacheDirInquirer } from '../inquirers/initInquirers';
import fs from 'fs';
import { clearDir, copyFile } from '../util/fsUtil';
import Helper from '../pub/helper';
import paths from '../data/paths';

enum FileStatus {
  dir,
  file,
  empty,
  notFind,
}

interface ConfigParams {
  dirName: string;
  cacheDirPathProvider?: (type: string) => string;
  targetDirPath: string;
  repoProvider?: (type: string) => string;
}

class Init extends Helper {
  constructor() {
    super();
  }
  cacheDirPathStr = '';
  targetDirPath = '';
  repo = '';
  dirName;
  initConfig(config: ConfigParams) {
    const { dirName, cacheDirPathProvider, targetDirPath, repoProvider } = config;
    this.dirName = dirName;
    this.targetDirPath = targetDirPath;
    if (repoProvider) {
      this.repoProvider = repoProvider;
    }
    if (cacheDirPathProvider) {
      this.cacheDirPathProvider = cacheDirPathProvider;
    }
  }

  cacheDirPathProvider(type) {
    return paths.cacheDirPathProvider(type);
  }

  async start() {
    const { tempType } = await tempTypeInquirer();
    this.cacheDirPathStr = this.cacheDirPathProvider(tempType);
    this.repo = this.repoProvider(tempType);
    await this.startControl(tempType);
    const dirStatus = this.checkEmptyDir(this.targetDirPath);
    if (dirStatus === FileStatus.dir) {
      await this.clearTargetDir(this.dirName);
    } else if (dirStatus !== FileStatus.empty) {
      fs.mkdirSync(this.targetDirPath); //没有则创建一个目录
    }
    copyFile(this.cacheDirPathStr, this.targetDirPath);
    logger.success('create a new project success');
  }

  repoProvider(tempType: string) {
    return gitRepo[tempType];
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
    const dirStatus = this.checkEmptyDir(this.cacheDirPathStr);

    if (dirStatus !== FileStatus.dir) {
      return true;
    }
    const { up } = await upCacheDirInquirer(tempType);
    if (up) {
      clearDir(this.cacheDirPathStr);
    }
    return up;
  }

  downloadAsync() {
    const spinner = ora('downloading template').start();
    return new Promise((resolve, reject) => {
      download(`direct:${this.repo}`, this.cacheDirPathStr, { clone: true }, function (err) {
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
    const { clear } = await clearDirInquirer(dirName);
    if (!clear) {
      this.exit();
    }
    clearDir(this.targetDirPath);
  } // is clear target dir ?
}

export default Init;
