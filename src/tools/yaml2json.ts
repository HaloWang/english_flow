import * as yaml from 'js-yaml'
import * as fs from 'fs'

const fileName = process.argv[2]
if (!fileName) {
  console.error(`Can not find file name!`)
}

const options = process.argv[3]

const Should = {
  FormatGeneratedJSONFile: false,
  OrderDictKeys: false,
  FenerateYAML: false,
}

const ProcessingDict = fileName === 'dictionary'

if (options) {
  if (options.includes('f')) {
    Should.FormatGeneratedJSONFile = true
  }
  if (options.includes('o')) {
    Should.OrderDictKeys = true
  }
  if (options.includes('g')) {
    Should.FenerateYAML = true
  }
}

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

function write() {
  const yamlString = fs.readFileSync(sourceFilePath, `utf8`)

  let objectFromYaml: any

  try {
    objectFromYaml = yaml.load(yamlString)
  } catch (e) {
    console.error(e)
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

  fs.writeFile(targetFilePath, finalJSONString, { encoding: `utf8` }, errorInfo => {
    if (errorInfo) {
      console.error(errorInfo)
    } else {
      console.log(`Update ${fileName}!`)
    }
  })

  if (ProcessingDict) {
    // 如果只有单词释义, 则不结构化的单词信息, 仅保留单词释义
    for (const key of Object.keys(objectFromYaml)) {
      const value = objectFromYaml[key]
      if (typeof value === 'object') {
        if (Object.keys(value).length === 1) {
          objectFromYaml[key] = value.m
        }
      }
    }
  }

  if (Should.FenerateYAML) {
    fs.writeFile(
      targetYamlFilePath,
      yaml.dump(objectFromYaml, {
        skipInvalid: true,
        lineWidth: 100,
      }),
      { encoding: `utf8` },
      errorInfo => {
        if (errorInfo) {
          console.error(errorInfo)
        } else {
          console.log(`Update ${fileName}!`)
        }
      },
    )
  }
}

write()
console.log(`Watching ${fileName}!`)
fs.watchFile(sourceFilePath, { interval: 1000 }, (curr, prev) => {
  write()
})
