/** @format */

import fs from 'fs';
import pathUtil from 'path';
import path from 'path';
export const clearDir = (path: string, isRemoveDir?: boolean) => {
  const stat = fs.lstatSync(path);
  if (stat.isFile()) {
    fs.unlinkSync(path);
    return;
  }
  const dirs = fs.readdirSync(path);
  dirs.forEach((dir) => {
    clearDir(pathUtil.join(path, dir), true);
  });
  if (isRemoveDir) {
    fs.rmdirSync(path);
  }
};

export const safeRemoveFile = (path: string) => {
  const hasFile = fs.existsSync(path);
  if (hasFile) {
    fs.unlinkSync(path);
  }
};
export const copyFile = (sourcePath: string, targetPath: string, isMk?: boolean) => {
  const stat = fs.lstatSync(sourcePath);
  if (stat.isDirectory() && isMk) {
    fs.mkdirSync(targetPath);
  } else if (stat.isFile()) {
    fs.copyFileSync(sourcePath, targetPath);
    return;
  }
  const dirs = fs.readdirSync(sourcePath);
  dirs.forEach((dir) => {
    copyFile(path.join(sourcePath, dir), path.join(targetPath, dir), true);
  });
};

export const parsePath = (rootPath: string, path?: string) => {
  if (!path || pathUtil.isAbsolute(path)) {
    return path;
  } //是否是绝对路径
  const fatherPath = pathUtil.dirname(rootPath);
  return pathUtil.resolve(fatherPath, path);
};
