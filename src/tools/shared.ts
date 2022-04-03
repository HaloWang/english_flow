import * as fs from 'fs'

export function hl_readFile(path: string, callback: (data: string) => void) {
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    callback(data)
  })
}

export function hl_watch(path: string, invoke: (fileString: string) => string | void) {
  const pathLog = path.replace(process.cwd(), '').split('/').pop()
  let fileStringStored = ''

  console.log(' ⚙️  initializing:', pathLog)
  hl_readFile(path, initResult => {
    if (initResult === undefined || initResult === null) {
      console.error('❌ file string is', initResult)
      return
    }

    const invokeReult = invoke(initResult)
    console.log(' ⚙️  initialized:', pathLog)
    if (typeof invokeReult === 'string') {
      fileStringStored = invokeReult
    } else {
      fileStringStored = initResult
    }

    console.log(' 🔃 watching:', pathLog)
    fs.watch(path, 'utf-8', event => {
      if (event !== 'change') return
      hl_readFile(path, watchResult => {
        if (watchResult === undefined || watchResult === null) {
          console.error('❌ file string is', watchResult)
          return
        }

        if (fileStringStored === watchResult) {
          console.log(' ⏭  Same content, skip:', pathLog)
          return
        }

        fileStringStored = watchResult

        const invokeReult = invoke(watchResult)
        if (typeof invokeReult === 'string') {
          fileStringStored = invokeReult
        }
      })
    })
  })
}
