import * as https from 'https'
import { IncomingMessage, ServerResponse } from 'http'
import { writeFile } from 'fs/promises'

export const guessEnglishByPersonalDict = async (
  req: IncomingMessage,
  res: ServerResponse,
  serverDictObj: { [key: string]: any },
) => {
  return new Promise<boolean>((_resolve, _reject) => {
    let buffer = ''
    req.on('data', chunk => {
      buffer += chunk
    })
    req.on('end', () => {
      try {
        const body = JSON.parse(buffer)
        guess(body.url, serverDictObj)
          .then(is => {
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(200)
            res.end(JSON.stringify({ is }))
          })
          .catch(reason => {
            _reject(reason)
          })
      } catch (error) {
        console.log('???')
        console.log(error)
        res.writeHead(500)
        res.end('')
      }
    })
  })
}

// 其实这个功能也不是太需要, 毕竟我在前端把所有的英语单词都匹配到就行了
// 又不是什么远程请求而是 localhost request

async function guess(url: string, serverDictObj: { [key: string]: any }) {
  return new Promise<boolean>((_resolve, _reject) => {
    const style = /<style[\S\s]+?style>/gm
    const script = /<script[\S\s]+?script>/gm
    const comment = /<![\S\s]+?->/gm
    const element = /<[\S\s]+?>/gm

    try {
      const request_2 = https.request(url, { timeout: 1000 }, res_2 => {
        var data_2 = ''
        res_2.on('data', function (chunk_2) {
          data_2 += chunk_2
        })
        res_2.on('end', function () {
          let htmlString = data_2
            .replaceAll('\n', '')
            .replaceAll(style, '')
            .replaceAll(comment, '')
            .replaceAll(script, '')
            .replaceAll(element, '')
          while (htmlString.includes('\n')) {
            htmlString = htmlString.replaceAll('\n', '')
          }
          while (htmlString.includes('\r')) {
            htmlString = htmlString.replaceAll('\r', '')
          }
          while (htmlString.includes('  ')) {
            htmlString = htmlString.replaceAll('  ', ' ')
          }
          while (htmlString.includes('> <')) {
            htmlString = htmlString.replaceAll('> <', '><')
          }
          writeFile(`${process.cwd()}/logs/${Date.now()}.log`, htmlString)
          const words = htmlString.matchAll(/[A-Za-z]+/g)
          let has = false
          for (const wordRes of words!) {
            let word = wordRes[0]
            if (word.length >= 3) {
              word = word.substring(0, word.length - 1)
              // console.log(word)
              if (serverDictObj[word] !== undefined) {
                has = true
                // console.log(word)
                break
              }
            }
          }
          _resolve(has)
        })
      })

      request_2.on('error', function (e) {
        // TODO: fuck, I need a proxy, or even a chromium in node.js
        console.log(__filename, e.message)
        _resolve(false)
      })
      request_2.end()
    } catch (error) {
      console.log(__filename, error)
      _resolve(false)
    }
  })
}
