import * as fs from 'fs'
import * as os from 'os'
import { hl_watch } from '../backend/shared'

const Path = process.argv[2]
const TemplateFilePath = process.cwd() + '/entry/template.js'
const TargetFilePath = process.cwd() + '/dist/tampermonkey_entry.js'

hl_watch(TemplateFilePath, string => {
  let replaceText = os.userInfo().username + '/' + Path
  // if (process.platform === 'win32') {
  //   replaceText = replaceText.replaceAll('/', '\\')
  // }
  let newFileString = string.replace(/🚧🚧🚧/g, replaceText)

  if (os.platform() === 'darwin') {
    newFileString = newFileString.replace(/C:\//g, '')
  }

  fs.writeFileSync(TargetFilePath, newFileString)

  console.log(' ✅ entry updated ')
})
