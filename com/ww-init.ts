import {program} from 'commander';
import inquirer from 'inquirer';
import {op} from '../data/inquirerOptions';
import {op1} from '../data/t1'
program
    .usage('<project-name>');

program.parse(process.argv);

function init() {
    const dirName=program.args[0];
    console.log(`your product name ${dirName}`);
    console.log(op());
    op1();
}


init();