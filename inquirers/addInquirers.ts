import inquirer from 'inquirer';
export const sameTempNameInquirer=()=>{
    return inquirer.prompt([
        {
            type:"list",
            name:"nameType",
            default:"exit",
            message:"has same template name please check!",
            choices:[
                "overwrite",
                "rename",
                "exit"
            ]
        }
    ]);
}