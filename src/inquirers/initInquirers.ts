/** @format */

import inquirer from 'inquirer';
export const tempTypeInquirer = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'tempType',
      default: 'admin',
      message: 'please check your template type!',
      choices: ['admin', 'components'],
    },
  ]);
};

export const clearDirInquirer = (dirName: string) => {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'clear',
      message: `clear ${dirName} dir?`,
      default: false,
    },
  ]);
};

export const upCacheDirInquirer = (tempType: string) => {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'up',
      message: `up ${tempType} template?`,
      default: false,
    },
  ]);
};
