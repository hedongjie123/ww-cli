import Helper from './helper';
import fs from 'fs';
import { success } from '../util/logger';
import pathUtil from 'path';
import { inputNameInquirer, sameTempNameInquirer } from '../inquirers/addInquirers';
import { safeRemoveFile } from '../util/fsUtil';

type FileControlType = 'write' | 'overwrite' | 'rename' | 'exit';
type FileControlModel = Record<FileControlType, VoidFunction>;

class TempChangeHelper extends Helper {
  name = '';
  doc = '';
  path = '';
  ext = '';
  fileName = '';
  tempJsonPath = '';
  tempLocalPath = '';
  tempConfig: Record<string, any> = {}; //原始配置文件
  fileControl: FileControlModel = {
    write: this.writeTemp.bind(this),
    overwrite: this.overwriteTemp.bind(this),
    rename: this.renameTemp.bind(this),
    exit: this.exit,
  };

  constructor() {
    super();
  }

  initTempConfig(tempConfig) {
    return tempConfig;
  }

  protected readTempConfig() {
    const tempConfigStr = fs.readFileSync(this.tempJsonPath).toString();
    this.tempConfig = this.initTempConfig(JSON.parse(tempConfigStr));
  } //获取本地默认配置

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
  } //写入文件

  protected writeTempLocalFile(localJson: Record<string, any>, fileName: string, filePath: string) {
    const fileContent = fs.readFileSync(filePath);
    fs.writeFileSync(pathUtil.join(this.tempLocalPath, fileName), fileContent);
    fs.writeFileSync(this.tempJsonPath, JSON.stringify(localJson));
  }

  protected overwriteTemp() {
    const itemConfig = this.tempConfig[this.name];
    const { fileName } = itemConfig;
    const ext = pathUtil.extname(fileName);
    const filePath = pathUtil.join(this.tempLocalPath, `${this.name}${ext}`);
    safeRemoveFile(filePath);
    this.writeTemp();
  }

  protected async renameTemp() {
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
