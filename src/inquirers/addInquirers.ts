/** @format */

import inquirer from 'inquirer'
export const sameTempNameInquirer = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'nameType',
            default: 'exit',
            message: 'has same template name please check!',
            choices: ['overwrite', 'rename', 'exit'],
        },
    ])
}
export const inputNameInquirer = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'tempName',
            message: 'please input a template new name!',
            validate(input: any) {
                return input?.trim() !== ''
            },
        },
    ])
}
