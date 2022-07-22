// hello
'use strict';

var commander = require('commander');

commander.program.version(require('../package').version).usage('<command> [options]').command("init", "select a template for you product");
commander.program.parse(process.argv);
