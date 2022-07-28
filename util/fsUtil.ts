import fs from 'fs';
export const clearDir=(path:string)=>{
    const stat=fs.lstatSync(path);
    if (stat.isFile()){
        fs.unlinkSync(path);
        return;
    }
    const dirs=fs.readdirSync(path);
    dirs.forEach((dir)=>{
        clearDir(dir);
    });
    fs.rmdirSync(path);
};

export const safeRemoveFile=(path:string)=>{
    const hasFile=fs.existsSync(path);
    if (hasFile){
        fs.unlinkSync(path);
    }
}