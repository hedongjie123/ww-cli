import {program} from 'commander';

program
    .version(require('../package').version)
    .usage('<command> [options]') //cli doc
    .command("init","select a template for you product")
    .command("add","add your template")
    .command("use","use your template")
    .command("rm","remove your template")
    .command("modify","modify your template")

program.parse(process.argv);