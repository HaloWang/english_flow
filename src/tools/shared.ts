import * as fs from 'fs'

/**
 * What file, if file string changed or initilization, call back
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
