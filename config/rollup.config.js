const path=require("path");
const clear = require('rollup-plugin-clear');
const typescript = require('rollup-plugin-typescript2');
const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babelConfig=require("./babel.config");
const rollupAddHeader=require("./plugins/rolluoAddHeader");
const outputDir=path.resolve();
const inputDir=path.resolve("./com");
export default {
    input:{
        ww:path.join(inputDir,"./ww.ts"),
        "ww-init":path.join(inputDir,"./ww-init.ts")
    },

    output:[
        {
            dir:outputDir,
            format:"cjs",
            footer: '// powered by ww',
            entryFileNames:"bin/[name].js",
            chunkFileNames:"lib/[name].js",
            manualChunks(id) {
                if (!id.includes("com")){
                    return path.basename(id,".ts");
                }
            }
            // preserveModules:true,//保留目录结构
        }
    ],
    plugins:[
        rollupAddHeader(),
        // clear({
        //     targets: [outputDir],
        // }),
        typescript(),
        babel(babelConfig),
        nodeResolve({
            resolveOnly: ['node_modules'], //定义为模块
        }),
        commonjs()//CommonJS和npm
    ]
}