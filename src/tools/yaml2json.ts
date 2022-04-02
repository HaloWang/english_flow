import * as yaml from 'js-yaml'
import * as fs from 'fs'
import { hl_watch } from './shared'

const fileName = process.argv[2]
if (!fileName) {
  console.error(`Can not find file name!`)
}

const options = process.argv[3]

const Should = {
  KeyToLowerCase: false,
  /** 是否生成格式化的 json */
  FormatGeneratedJSONFile: false,
  /** 将 object 的 key 根据排序 */
  OrderDictKeys: false,
  /** 重新生成经过 OrderDictKeys 的 yaml */
  GenerateYAML: false,
  /** 将生成的 yaml 重写至原始位置 */
  YAMLRewrite: false,
}

if (options) {
  if (options.includes('l')) {
    Should.KeyToLowerCase = true
  }
  if (options.includes('f')) {
    Should.FormatGeneratedJSONFile = true
  }
  if (options.includes('o')) {
    Should.OrderDictKeys = true
  }
  if (options.includes('g')) {
    Should.GenerateYAML = true
  }
  if (options.includes('r')) {
    Should.YAMLRewrite = true
  }
}

const ProcessingDict = fileName === 'dictionary'
const distDir = process.cwd() + `/dist/data`
const srcDic = process.cwd() + `/src/data`

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir)
}

let sourceFilePath = srcDic + `/${fileName}.yaml`
let targetFilePath = distDir + `/${fileName}.json`
let targetYamlFilePath = distDir + `/DONT_USE_${fileName}.yaml`

if (process.platform !== 'darwin') {
  function replaceSlash(text: string): string {
    let result = text
    while (result.includes('/')) {
      result = result.replace('/', '\\')
    }
    return result
  }
  sourceFilePath = replaceSlash(sourceFilePath)
  targetFilePath = replaceSlash(targetFilePath)
  targetYamlFilePath = replaceSlash(targetYamlFilePath)
}

hl_watch(sourceFilePath, string => {
  const yamlString = string

  let objectFromYaml: any

  try {
    objectFromYaml = yaml.load(yamlString)
  } catch (e) {
    console.error(e)
  }

  if (Should.KeyToLowerCase) {
    const keys = Object.keys(objectFromYaml)
    let n = keys.length
    while (n--) {
      const key = keys[n]
      const m = key.match(/[A-Z]/)
      if (m) {
        objectFromYaml[key.toLocaleLowerCase()] = objectFromYaml[key]
        delete objectFromYaml[key]
      }
    }
  }

  if (Should.OrderDictKeys) {
    objectFromYaml = Object.keys(objectFromYaml)
      .sort()
      .reduce((obj, key) => {
        obj[key] = objectFromYaml[key]
        return obj
      }, {})
  }

  if (ProcessingDict) {
    // 如果只有单词释义, 则生成结构化的单词信息
    // {foo:bar} => {foo:{m:bar}}
    for (const k of Object.keys(objectFromYaml)) {
      const v = objectFromYaml[k]
      if (typeof v === 'string') {
        objectFromYaml[k] = {
          m: v,
        }
      }
    }
  }

  let finalJSONString = ''

  if (Should.FormatGeneratedJSONFile) {
    finalJSONString = JSON.stringify(objectFromYaml, null, 2)
  } else {
    finalJSONString = JSON.stringify(objectFromYaml)
  }

  try {
    fs.writeFileSync(targetFilePath, finalJSONString, 'utf8')
  } catch (error) {
    console.error(error)
  }

  if (ProcessingDict) {
    // 如果只有单词释义, 则不结构化的单词信息, 仅保留单词释义
    // {foo:{m:bar}} => {foo:bar}
    for (const key of Object.keys(objectFromYaml)) {
      const value = objectFromYaml[key]
      if (typeof value === 'object') {
        if (Object.keys(value).length === 1) {
          objectFromYaml[key] = value.m
        }
      }
    }
  }

  if (Should.OrderDictKeys && Should.GenerateYAML) {
    fs.writeFileSync(
      Should.YAMLRewrite ? sourceFilePath : targetFilePath,
      yaml.dump(objectFromYaml, {
        skipInvalid: true,
        lineWidth: 100,
      }),
      'utf8',
    )
  }

  console.log(` ✅ ${fileName} updated`)
})
