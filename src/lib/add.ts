import TempChangeHelper from '../pub/tempChangeHelper';

export interface ConfigParams {
  name: string;
  doc: string;
  path: string;
  ext: string;
  fileName: string;
  tempJsonPath: string;
  tempLocalPath: string;
}

class Add extends TempChangeHelper {
  constructor() {
    super();
  }
  initConfig(config: ConfigParams) {
    const { ext, name, fileName, path, doc, tempJsonPath, tempLocalPath } = config;
    this.name = name;
    this.path = path;
    this.doc = doc;
    this.ext = ext;
    this.fileName = fileName;
    this.tempJsonPath = tempJsonPath;
    this.tempLocalPath = tempLocalPath;
  }
  async start() {
    this.readTempConfig();
    await this.mkFileControl();
  }
}

export default Add;
