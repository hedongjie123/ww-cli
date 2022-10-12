import TempChangeHelper from '../pub/tempChangeHelper';

export interface ConfigParams {
  check: boolean;
  path: string;
  tempJsonPath: string;
  name: string;
}

class Use extends TempChangeHelper {
  constructor() {
    super();
  }
  check = false;
  list = false;
  initConfig(config: ConfigParams) {
    const { check, path, tempJsonPath, name, tempLocalPath } = config;
    this.check = check;
    this.path = path;
    this.tempJsonPath = tempJsonPath;
    this.name = name;
    this.tempLocalPath = tempLocalPath;
  }
  async start() {
    this.readTempConfig();
    if (this.name) {
      this.useNameControl();
      return;
    }
    if (this.check) {
      await this.useCheckControl();
      return;
    }
    await this.useListControl();
  }
}

export default Use;
