/** @format */

import {program} from 'commander'

program
    .usage('<tmp-name>')
    .option('-l, --list', 'show your template list')
    .option('-c, --check', 'check template')
    .option('-p,--path', 'output template path')
