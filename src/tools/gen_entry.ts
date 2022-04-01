import * as fs from 'fs'
import * as os from 'os'

const Path = process.argv[2]
const TemplateFilePath = process.cwd() + '/entry/template.js'
const TargetFilePath = process.cwd() + '/dist/tampermonkey_entry.js'

function write() {
  let replaceText = os.userInfo().username + '/' + Path
  // if (process.platform === 'win32') {
  //   replaceText = replaceText.replaceAll('/', '\\')
  // }
  let newFileString = fs
    .readFileSync(TemplateFilePath, { encoding: 'utf8' })
    .replace(/🚧🚧🚧/g, replaceText)

  if (os.platform() === 'darwin') {
    newFileString = newFileString.replace(/C:\//g, '')
  }

  fs.writeFile(TargetFilePath, newFileString, _ => {})
}

write()

fs.watchFile(TemplateFilePath, { interval: 2000 }, (curr, prev) => {
  write()
})
