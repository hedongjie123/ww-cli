import TempChangeHelper from '../pub/tempChangeHelper';
import { error, success } from '../util/logger';
import { ConfigParams } from './add';
import pathUtil from 'path';
import { safeRemoveFile } from '../util/fsUtil';

export interface ModifyConfigParams extends ConfigParams {
  modifyName: string;
}
class Modify extends TempChangeHelper {
  constructor() {
    super();
  }
  modifyName: string;
  initConfig(config: ModifyConfigParams) {
    const { modifyName, name, path, doc, tempJsonPath, tempLocalPath, fileName, ext } = config;
    this.modifyName = modifyName;
    this.name = name;
    this.path = path;
    this.doc = doc;
    this.tempJsonPath = tempJsonPath;
    this.tempLocalPath = tempLocalPath;
    this.fileName = fileName;
    this.ext = ext;
  }
  async start() {
    this.readTempConfig();
    this.checkNewName();
    this.startClear();
    await this.mkFileControl();
  }
  protected startClear() {
    const modifyItem = this.tempConfig[this.modifyName];
    if (!modifyItem) {
      return;
    }
    const newItem = {
      fileName: this.fileName,
      doc: this.doc,
    };
    const keys = Object.keys(newItem);
    keys.forEach((key) => {
      if (!newItem[key]?.trim()) {
        newItem[key] = modifyItem[key];
      }
    });
    this.fileName = newItem.fileName;
    this.doc = newItem.doc;
    Reflect.deleteProperty(this.tempConfig, this.modifyName);
    safeRemoveFile(pathUtil.join(this.tempLocalPath, this.name + this.ext));
  }

  protected checkNewName() {
    if (!this.tempConfig[this.modifyName]) {
      error('must input a ture template name!');
      this.exit();
    }
  }

  public writeTempClear() {
    success('success:modify a template! ');
  }
}

export default Modify;
