import {program} from 'commander';

program
    .version(require('../package').version)
    .usage('<command> [options]') //cli doc
    .command("init","select a template for you product")

program.parse(process.argv);