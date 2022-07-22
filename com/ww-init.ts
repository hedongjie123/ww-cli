import {program} from 'commander';
import * as gitRepo from '../data/gitRepo';
import download from 'download-git-repo';
import path from 'path';
import * as logger from '../util/logger';
import ora from 'ora';
import {clearDirInquirer, tempTypeInquirer, upCacheDirInquirer} from "../util/inquirers";
import fs from 'fs';
import {clearDir} from "../util/fsUtil";

program
    .usage('<project-name>');

program.parse(process.argv);

class templateInit {
     constructor() {
         this.init();
     }
     cachePath=path.join(__dirname,"..");// cli path to save template
     targetPath=path.resolve();//cmd path to cp template
     cacheDirPath="";
     targetDirPath="";
     repo="";
     async init(){
         const dirName=program.args[0]||"ww-admin-temp";
         const {tempType}=await tempTypeInquirer();
         this.repo=gitRepo[tempType];
         this.cacheDirPath=path.join(this.cachePath,`tmp-${tempType}`);
         this.targetDirPath=path.join(this.targetPath,dirName);
         await this.startControl(tempType);
         const isEmptyDir=this.checkEmptyDir(this.targetDirPath);
         if (!isEmptyDir){
             await this.clearTargetDir(dirName);
         }
     };
    async startControl(tempType:string){
          const isUp=await this.clearCacheDir(tempType);
          if (!isUp){
              return;
          }
          try {
            await this.downloadAsync();
            logger.success("success:downloading template")
          }catch (e) {
            logger.error("fail:downloading template");
            process.exit(0);
          }
    }//is up cache?

    async clearCacheDir(tempType:string){
        const isEmptyDir=this.checkEmptyDir(this.cacheDirPath);
        if (isEmptyDir){
            return true;
        }
        const {up}=await upCacheDirInquirer(tempType);
        if (up){
           clearDir(this.cacheDirPath);
        };
        return up;
    }
    downloadAsync(){
        const spinner = ora('downloading template').start();
        return new Promise((resolve,reject)=>{
            download(`direct:${this.repo}`,this.cacheDirPath, { clone: true }, function (err) {
                spinner.stop();
                if (err){
                    return reject(err);
                }
                resolve("success");
            })
        })
    };//clone git repo

    checkEmptyDir(dirPath:string){
        if (!fs.existsSync(dirPath)){
            return true;
        }
        const stat=fs.lstatSync(dirPath);
        return !stat.isDirectory();
    };//check dir or file

    async clearTargetDir(dirName:string) {
        const dirPath=path.join(this.targetPath,dirName);
        const {clear}=await clearDirInquirer(dirName);
        if (!clear){
            process.exit(0);
        }
        clearDir(dirPath);
    }// is clear target dir ?
}

new templateInit();