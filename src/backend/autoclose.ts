import * as express from 'express'
import { chownSync, readFileSync } from 'node:fs'

const server = express()
const port = 4000

server.use(express.json())

server.get('/T', (req, res) => {
  res.type('.html')
  res.send(readFileSync(process.cwd() + '\\src\\backend\\api.index.html', 'utf8'))
})

const AutoCloseURLStack: { [key: string]: { res: express.Response | null; ms: number | null } } = {}
const AutoCloseTimeout = 3 * 1000

server.post('/this_url_opened_by_english_flow', (req, res) => {
  console.log('setup open')
  console.log(req.body)
  const { url } = req.body as { url: string }
  AutoCloseURLStack[url] = {
    res: null,
    ms: null,
  }
  res.send('{}')
})

server.post('/im_waiting_for_your_close_command', (req, res) => {
  console.log('long poll')
  // console.log(req.body)
  const { url } = req.body as { url: string }

  if (AutoCloseURLStack[url]) {
    res.setTimeout(10000000)
    AutoCloseURLStack[url] = {
      res,
      ms: Date.now(),
    }
  } else {
    const responseObject = { msg: 'not_my_deal' }
    console.log(responseObject)
    res.send(JSON.stringify(responseObject))
  }
})

server.post('/tell_outdated_webpages_to_close_themself', (req, res) => {
  console.log('fire')

  let notNull = 0
  let msNotNull = 0
  for (const fuck in AutoCloseURLStack) {
    if (AutoCloseURLStack[fuck].res !== null) {
      notNull += 1
      msNotNull += 1
    }
  }
  console.log(Object.keys(AutoCloseURLStack).length, notNull, msNotNull)
  for (const k in AutoCloseURLStack) {
    const info = AutoCloseURLStack[k]
    if (info.ms !== null && info.res !== null) {
      if (AutoCloseTimeout < Date.now() - info.ms) {
        const responseObject = { close: true }
        console.log('🚧 send close', responseObject)
        info.res.send(JSON.stringify(responseObject))
        delete AutoCloseURLStack[k]
      }
    }
  }
  res.send('{}')
  //
})

server.listen(port, () => {
  console.log(`✅ server start at:${port}`)
})
