// hello
'use strict';

var commander = require('commander');
var inquirerOptions = require('./lib/inquirerOptions.js');
var t1 = require('./lib/t1.js');

commander.program.usage('<project-name>');
commander.program.parse(process.argv);

function init() {
  const dirName = commander.program.args[0];
  console.log(`your product name ${dirName}`);
  console.log(inquirerOptions.op());
  t1.op1();
}

init();
