import Helper from './helper';
import fs from 'fs';
import paths from '../data/paths';
import { program } from 'commander';
import { error, success } from '../util/logger';
import pathUtil from 'path';
import { inputNameInquirer, sameTempNameInquirer } from '../inquirers/addInquirers';
import { parsePath, safeRemoveFile } from '../util/fsUtil';

export interface OpsModel {
  name?: string;
  doc?: string;
  path?: string;
  config?: string;
}
export interface TempInfoModel {
  name: string;
  ext: string;
}
type FileControlType = 'write' | 'overwrite' | 'rename' | 'exit';
type FileControlModel = Record<FileControlType, VoidFunction>;

class TempChangeHelper extends Helper {
  name = '';
  doc = '';
  path = '';
  ext = '';
  fileName = '';
  tempConfig: Record<string, any> = {}; //原始配置文件
  fileControl: FileControlModel = {
    write: this.writeTemp.bind(this),
    overwrite: this.overwriteTemp.bind(this),
    rename: this.renameTemp.bind(this),
    exit: this.exit,
  };

  constructor() {
    super();
    this.readTempConfig();
  }
  initTempConfig(tempConfig) {
    return tempConfig;
  }
  protected optionsProvider() {
    const { path, doc, name, ext, fileName } = this.getOptions();
    this.name = name;
    this.path = path;
    this.doc = doc;
    this.ext = ext;
    this.fileName = fileName;
  }
  private readTempConfig() {
    const tempConfigStr = fs.readFileSync(paths.tempLocalJson).toString();
    this.tempConfig = this.initTempConfig(JSON.parse(tempConfigStr));
  } //获取本地默认配置
  public getOptions() {
    const tmpName = program.args[0];
    const { config, doc, path, name: opName = tmpName } = program.opts<OpsModel>();
    const { name = opName, doc: tmpDoc = doc, path: tmpPath = path } = this.getConfig(config);
    if (!tmpPath) {
      //没有模版路径
      error('--path options is required');
      this.exit();
    }
    const rqPath = tmpPath as string;
    const { name: tName, ext } = this.getDefaultTempNameInfo(rqPath, name);
    return {
      name: tName,
      doc: tmpDoc || '',
      path: rqPath,
      ext,
      fileName: pathUtil.basename(rqPath),
    };
  }
  private getConfig(config?: string): OpsModel {
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
  }
  protected async mkFileControl() {
    const { nameType } = await this.checkName();
    this.fileControl[nameType]();
  } //流程控制
  protected checkName(): any {
    if (!this.tempConfig[this.name]) {
      return { nameType: 'write' };
    }
    return sameTempNameInquirer(); //如果有重名
  }
  protected getDefaultTempNameInfo(path: string, name?: string): TempInfoModel {
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
  } //如果没有名称默认文件名称
  protected writeTemp() {
    const newWWJson: Record<string, any> = {
      ...this.tempConfig,
      [this.name]: {
        doc: this.doc,
        fileName: this.fileName,
      },
    };
    const filePath = this.path as string;
    const fileName = this.name + this.ext;
    this.writeTempLocalFile(newWWJson, fileName, filePath);
    this.writeTempClear();
  }
  protected writeTempLocalFile(localJson: Record<string, any>, fileName: string, filePath: string) {
    const fileContent = fs.readFileSync(filePath);
    fs.writeFileSync(pathUtil.join(paths.tempLocal, fileName), fileContent);
    fs.writeFileSync(paths.tempLocalJson, JSON.stringify(localJson));
  }
  overwriteTemp() {
    const itemConfig = this.tempConfig[this.name];
    const { fileName } = itemConfig;
    const ext = pathUtil.extname(fileName);
    const filePath = pathUtil.join(paths.tempLocal, `${this.name}${ext}`);
    safeRemoveFile(filePath);
    this.writeTemp();
  }
  async renameTemp() {
    const { tempName } = await inputNameInquirer();
    this.name = tempName;
    const { nameType } = await this.checkName();
    this.fileControl[nameType]();
  }
  writeTempClear() {
    success('success:add a template!');
  }
}

export default TempChangeHelper;
