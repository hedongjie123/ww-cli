import TempChangeHelper from '../pub/tempChangeHelper';

export interface ConfigParams {
  check: boolean;
  path: string;
  tempJsonPath: string;
  name: string;
  tempLocalPath: string;
  list: boolean;
}

class Use extends TempChangeHelper {
  constructor() {
    super();
  }
  check = false;
  list = false;
  initConfig(config: ConfigParams) {
    const { check, path, tempJsonPath, name, tempLocalPath, list } = config;
    this.check = check;
    this.path = path;
    this.tempJsonPath = tempJsonPath;
    this.name = name;
    this.tempLocalPath = tempLocalPath;
    this.list = list;
    this.readTempConfig();
  }
  async start() {
    this.readTempConfig();
    if (this.list) {
      this.useListControl();
      return;
    }
    if (this.name) {
      this.useNameControl();
      return;
    }
    await this.useCheckControl();
  }
}

export default Use;
