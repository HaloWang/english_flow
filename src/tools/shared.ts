import * as fs from 'fs'

/**
 * Watch file, if file content as UTF-8 string changed or node process initilization, execute @param initAndChange
 */
export function hl_watch(path: string, initAndChange: (fileString: string) => void) {
  console.log('🔃 watching:', path.replace(process.cwd(), ''))
  const getCurrentFileStringSync = () => fs.readFileSync(path, 'utf8')
  let fileStringStored = getCurrentFileStringSync()
  initAndChange(fileStringStored)
  fs.watch(path, event => {
    if (event !== 'change') return
    const newFileString = getCurrentFileStringSync()
    if (fileStringStored === newFileString) {
      return
    }
    fileStringStored = newFileString
    initAndChange(fileStringStored)
  })
}

function ng_hl_watch(path: string, invoke: (fileString: string) => string) {
  console.log('🔃 watching:', path.replace(process.cwd(), ''))
  fs.watch(path, 'utf-8', event => {
    console.log(event)
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      if (data === undefined || data === null) {
        console.error(err)
        return
      }
    })
  })
}
