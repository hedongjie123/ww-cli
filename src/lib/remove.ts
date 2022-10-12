import TempChangeHelper from '../pub/tempChangeHelper';

export interface ConfigParams {
  tempJsonPath: string;
  name: string;
  tempLocalPath: string;
}
class Remove extends TempChangeHelper {
  constructor() {
    super();
  }
  initConfig(config: ConfigParams) {
    const { name, tempJsonPath, tempLocalPath } = config;
    this.name = name;
    this.tempJsonPath = tempJsonPath;
    this.tempLocalPath = tempLocalPath;
    this.readTempConfig();
  }
  start() {
    if (this.name) {
      this.rmNameControl();
      return;
    }
    this.rmCheckControl();
  }
}

export default Remove;
