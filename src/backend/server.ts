import * as fs from 'fs'
import { createServer, IncomingMessage, ServerResponse } from 'http'
import { hl_watch } from '../shared'

const dictJSONPath = process.cwd() + `/dist/data/dict.json`
const profileJSONPath = process.cwd() + `/dist/data/profile.json`
const host = 'localhost'
const port = 8000

let serverDictObj: any = {}
let dictMark = 0

hl_watch(dictJSONPath, latestString => {
  try {
    serverDictObj = JSON.parse(latestString)
    dictMark += 1
  } catch (error) {
    console.log('EF: JSON parse error! check your json file!')
  }
})

const guessEnglishByPersonalDict = (url: string) => {
  for (const key of Object.keys(serverDictObj)) {
  }
  return false
}

const listener = (req: IncomingMessage, res: ServerResponse) => {
  const option = req.url || ''
  switch (option) {
    case '/all': {
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(200)
      const finalObj = {
        dictMark,
        dict: serverDictObj,
      }
      res.end(JSON.stringify(finalObj))
      break
    }

    case '/dictMark': {
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(200)
      const finalObj = {
        dictMark,
      }
      res.end(JSON.stringify(finalObj))
      break
    }

    case '/profile': {
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(200)
      res.end(fs.readFileSync(profileJSONPath, { encoding: 'utf-8' }))
      break
    }

    case '/api': {
      let buffer = ''
      req.on('data', chunk => {
        buffer += chunk
      })
      req.on('end', () => {
        try {
          const body = JSON.parse(buffer)
          console.log(body)
          res.writeHead(200)
          res.end('')
        } catch (error) {
          console.log('parse error')
          res.writeHead(500)
          res.end('')
        }
      })
      break
    }

    default: {
      let requestData = ''
      req.on('data', chunk => {
        requestData += chunk
      })
      req.on('end', () => {
        console.log(JSON.parse(requestData))
      })
      res.writeHead(404)
      res.end('')
      break
    }
  }
}

const server = createServer(listener)

server.listen(port, host, () => {
  console.log(`EFServer is running on http://${host}:${port}`)
})
