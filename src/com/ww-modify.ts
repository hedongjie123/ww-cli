/** @format */

import { program } from 'commander';

program
  .usage('<tmp-name>')
  .option('-c, --config', 'modify template config')
  .option('-d, --doc', 'modify a template document')
  .option('-p, --path', 'modify a template ')
  .option('-h, --help', 'modify a template for your local repository');

class templateModify {
  constructor() {
    this.init();
  }
  init() {
    console.log('go go go');
  }
}

new templateModify();
