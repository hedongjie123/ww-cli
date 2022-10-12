/** @format */

import path from 'path';
export default {
  tempLocal: path.join(__dirname, '../tmp-local'),
  tempLocalJson: path.join(__dirname, '../tmp-local/ww.json'),
  cacheDirPathProvider: (type: string) => {
    return path.join(__dirname, `../tmp-${type}`);
  },
};
