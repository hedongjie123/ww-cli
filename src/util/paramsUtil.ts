import { program } from 'commander';
import pathUtil from 'path';
import { parsePath } from './fsUtil';
import paths from '../data/paths';
export interface OpsModel {
  name?: string;
  doc?: string;
  path?: string;
  config?: string;
  check?: boolean;
  list?: boolean;
}
interface TempInfoModel {
  name: string;
  ext: string;
}
const getTmpFileConfig = (config?: string): OpsModel => {
  if (!config) {
    return {};
  }
  const configPath = pathUtil.resolve(config);
  const { name, path, doc } = require(configPath);
  return {
    name,
    path: parsePath(configPath, path),
    doc,
  };
};
const getDefaultTempNameInfo = (path: string, name?: string): TempInfoModel => {
  const ext = pathUtil.extname(path);
  if (name) {
    return {
      name,
      ext,
    };
  }
  return {
    name: pathUtil.basename(path, ext),
    ext,
  };
}; //如果没有名称默认文件名称
export const getTmpFileOptions = () => {
  const tmpName = program.args[0];
  const { config, doc, path, name: opName = tmpName, check, list } = program.opts<OpsModel>();
  const { name = opName, doc: tmpDoc = doc, path: tmpPath = path } = getTmpFileConfig(config);
  if (!tmpPath) {
    return false;
  }
  const rqPath = tmpPath as string;
  const { name: tName, ext } = getDefaultTempNameInfo(rqPath, name);
  return {
    name: tName,
    doc: tmpDoc || '',
    path: rqPath,
    ext,
    fileName: pathUtil.basename(rqPath),
    tempJsonPath: paths.tempLocalJson,
    tempLocalPath: paths.tempLocal,
    check,
    list,
  };
}; //初始化模版命令参数
