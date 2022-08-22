import inquirer from 'inquirer';

export const localTemps = async (temps: Record<string, any>) => {
  const keys = Object.keys(temps);
  const choices = keys.map((key) => {
    const { doc } = temps[key];
    return `${key}(${doc})`;
  });
  const { tempName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'tempName',
      default: choices[0],
      message: 'check your remove template!',
      choices,
    },
  ]);
  const index = choices.indexOf(tempName);
  const key = keys[index];
  const tempItem = temps[key];
  return {
    ...tempItem,
    name: key,
  };
};
