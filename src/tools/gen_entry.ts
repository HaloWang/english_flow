import * as fs from 'fs'
import * as os from 'os'
import { hl_watch } from './shared'

const Path = process.argv[2]

// Main script of EnglishFlow
const EFTamplatePath = process.cwd() + '/entry/ef.js'
const EFTargetPath = process.cwd() + '/dist/tampermonkey_ef_entry.js'

// Assist script for quick copy
const EFCopyTemplatePath = process.cwd() + '/entry/efcopy.js'
const EFCopyTargetPath = process.cwd() + '/dist/tampermonkey_efcopy_entry.js'

hl_watch(EFTamplatePath, string => {
  let replaceText = os.userInfo().username + '/' + Path
  // if (process.platform === 'win32') {
  //   replaceText = replaceText.replaceAll('/', '\\')
  // }
  let newFileString = string.replace(/🚧🚧🚧/g, replaceText)

  if (os.platform() === 'darwin') {
    newFileString = newFileString.replace(/C:\//g, '')
  }

  fs.writeFileSync(EFTargetPath, newFileString)

  console.log(' ✅ ef entry updated ')
})

hl_watch(EFCopyTemplatePath, string => {
  let replaceText = os.userInfo().username + '/' + Path
  // if (process.platform === 'win32') {
  //   replaceText = replaceText.replaceAll('/', '\\')
  // }
  let newFileString = string.replace(/🚧🚧🚧/g, replaceText)

  if (os.platform() === 'darwin') {
    newFileString = newFileString.replace(/C:\//g, '')
  }

  fs.writeFileSync(EFCopyTargetPath, newFileString)

  console.log(' ✅ efcopy entry updated ')
})
