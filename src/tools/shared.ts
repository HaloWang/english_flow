import * as fs from 'fs'

/**
 * Watch file, if file content as UTF-8 string changed or node process initilization, execute @param initAndChange
 */
export function hl_watch(path: string, initAndChange: (fileString: string) => void) {
  console.log('🔃 watching:', path)
  const getCurrentFileStringSync = () => fs.readFileSync(path, 'utf8')
  let fileStringStored = getCurrentFileStringSync()
  initAndChange(fileStringStored)
  fs.watch(path, _ => {
    const newFileString = getCurrentFileStringSync()
    if (fileStringStored === newFileString) {
      return
    }
    fileStringStored = newFileString
    initAndChange(fileStringStored)
  })
}
