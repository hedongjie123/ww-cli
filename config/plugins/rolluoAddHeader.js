module.exports=()=>{
    return {
        name:"rollup-add-name",
        renderChunk:(code,{fileName})=>{
            let banner="#!/usr/bin/env node";
            if (fileName.includes("lib")){
                banner="//good luck"
            }
            return `${banner}\n${code}`
        }
    }
}