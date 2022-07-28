/** @format */

import {program} from 'commander'
import chalk from 'chalk'
import {error, success} from '../util/logger'
import pathUtil from 'path'
import {inputNameInquirer, sameTempNameInquirer} from '../inquirers/addInquirers'
import paths from '../data/paths'
import fs from 'fs'
import {safeRemoveFile} from '../util/fsUtil'

type FileControlType = 'write' | 'overwrite' | 'rename' | 'exit'
type FileControlModel = Record<FileControlType, VoidFunction>
interface ConfigModel {
    name?: string
    doc?: string
    path?: string
    config?: string
}
interface TempInfoModel {
    name: string
    ext: string
}
program
    .usage('<tmp-name>')
    .option('-c, --config <config>', 'add template config') //优先 config文件
    .option('-d, --doc <doc>', 'template document') //模版描述
    .option('-p, --path <path>', 'template file path') //模版路径
    .option('-h, --help', 'add a template for your games')

class templateAdd {
    name = ''
    doc = ''
    path = ''
    ext = ''
    fileName = ''
    tempConfig: Record<string, any> = {} //原始配置文件
    fileControl: FileControlModel = {
        write: this.writeTemp.bind(this),
        overwrite: this.overwriteTemp.bind(this),
        rename: this.renameTemp.bind(this),
        exit: this.exit,
    }
    constructor() {
        program.parse(process.argv)
        this.readTempConfig()
        this.init()
    }
    async init() {
        this.help()
        const {name, doc, path, ext, fileName} = this.getOptions()
        this.name = name //模版名称
        this.doc = doc //模版描述
        this.path = path //模版路径
        this.ext = ext //模版后缀名
        this.fileName = fileName
        const {nameType} = await this.checkSameName()
        this.fileControl[nameType]()
    }
    readTempConfig() {
        const tempConfigStr = fs.readFileSync(paths.tempLocalJson).toString()
        this.tempConfig = JSON.parse(tempConfigStr)
    }
    async checkSameName() {
        if (!this.tempConfig[this.name]) {
            return {nameType: 'write'}
        }
        return sameTempNameInquirer() //如果有重名
    }
    writeTemp() {
        const newWWJson = {
            ...this.tempConfig,
            [this.name]: {
                doc: this.doc,
                fileName: this.fileName,
            },
        }
        const filePath = this.path as string
        const fileContent = fs.readFileSync(filePath)
        const fileName = this.name + this.ext
        fs.writeFileSync(pathUtil.join(paths.tempLocal, fileName), fileContent)
        fs.writeFileSync(paths.tempLocalJson, JSON.stringify(newWWJson))
        success('success:add a template!')
    }
    overwriteTemp() {
        const itemConfig = this.tempConfig[this.name]
        const {fileName} = itemConfig
        const ext = pathUtil.extname(fileName)
        const filePath = pathUtil.join(paths.tempLocal, `${this.name}${ext}`)
        safeRemoveFile(filePath)
        this.writeTemp()
    }
    async renameTemp() {
        const {tempName} = await inputNameInquirer()
        this.name = tempName
        const {nameType} = await this.checkSameName()
        this.fileControl[nameType]()
    }
    exit() {
        process.exit(0)
    }
    help() {
        const {help} = program.opts()
        if (!help) {
            return
        }
        console.log('  Examples:')
        console.log()
        console.log(chalk.gray('    # add a new local template'))
        console.log('    $ ww add my-template --config demo.json --doc my template --path filePath ')
        console.log()
        process.exit(0)
    }
    getOptions() {
        const {config, doc, path} = program.opts<ConfigModel>()
        const tmpName = program.args[0]
        const {name = tmpName, doc: tmpDoc = doc, path: tmpPath = path} = this.getConfig(config)
        if (!tmpPath) {
            //没有模版路径
            error('--path options is required')
            process.exit(0)
        }
        const {name: tName, ext} = this.getDefaultTempNameInfo(tmpPath, name)
        return {
            name: tName,
            doc: tmpDoc || '',
            path: tmpPath,
            ext,
            fileName: pathUtil.basename(tmpPath),
        }
    }
    getDefaultTempNameInfo(path: string, name?: string): TempInfoModel {
        const ext = pathUtil.extname(path)
        if (name) {
            return {
                name,
                ext,
            }
        }
        return {
            name: pathUtil.basename(path, ext),
            ext,
        }
    } //如果没有名称默认文件名称
    getConfig(config?: string): ConfigModel {
        if (!config) {
            return {}
        }
        const configPath = pathUtil.resolve(config)
        const {name, path, doc} = require(configPath)
        return {
            name,
            path: this.parsePath(configPath, path),
            doc,
        }
    }
    parsePath(configPath: string, path?: string) {
        if (!path || pathUtil.isAbsolute(path)) {
            return path
        } //是否是绝对路径
        const fatherPath = pathUtil.dirname(configPath)
        return pathUtil.resolve(fatherPath, path)
    }
}

new templateAdd()
