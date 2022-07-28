/** @format */

import {program} from 'commander'

program
    .usage('<tmp-name>')
    .option('-c, --config', 'add template config')
    .option('-d, --doc', 'template document')
    .option('-p, --path', 'template file path')
    .option('-h, --help', 'add a template for your games')
