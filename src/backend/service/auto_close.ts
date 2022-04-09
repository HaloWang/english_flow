import { IncomingMessage, ServerResponse } from 'http'

const url_ms_map: { [key: string]: number } = {
  youdao: 0,
  google_define: 0,
  wikitionary: 0,
  google_translate: 0,
}

// var QQQ = 单词释义组
// open word explain webpage sets
// 不需要手动关闭 QQQ
// 打开 QQQ 时, 关闭已经打开超过一分钟的其他 QQQ
// QQQ 不随时间自动关闭, QQQ 关闭的时机应该是我选择再打开新的一组 QQQ, 且这组 QQQ 已经开启了一段时间了
// 最好能做成长轮询(其实不是轮询, 而是单词等待...)
// 我不想一个一个的写网络请求的解析了
// express.js? nest.js?

export const setAutoClose = (req: IncomingMessage, res: ServerResponse) => {
  let buffer = ''
  req.on('data', chunk => {
    buffer += chunk
  })
  req.on('end', () => {
    try {
      res.setHeader('Content-Type', 'application/json')

      const requestData = JSON.parse(buffer)
      const timestampToBrowser = Date.now()
      const responseData: { [key: string]: number } = {}
      switch (requestData.tag) {
        case 'youdao': {
          url_ms_map['youdao'] = timestampToBrowser
          break
        }
        case 'googleTranslate': {
          url_ms_map['googleTranslate'] = timestampToBrowser
          break
        }
        case 'wikitionay': {
          url_ms_map['wikitionay'] = timestampToBrowser
          break
        }
        case 'googleDefine': {
          url_ms_map['googleDefine'] = timestampToBrowser
          break
        }
        default:
          break
      }

      res.writeHead(200)
      res.end(
        JSON.stringify({
          timestampToBrowser,
        }),
      )
      res.end(JSON.stringify(responseData))
    } catch (error) {
      console.log('❤️‍🔥')
      console.log(error)
      res.writeHead(500)
      res.end()
    }
  })
}

export const getAutoClose = (req: IncomingMessage, res: ServerResponse) => {
  let buffer = ''
  req.on('data', chunk => {
    buffer += chunk
  })
  req.on('end', () => {
    try {
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(200)
      const requestData = JSON.parse(buffer)
      let shouldAutoClose = false
      switch (requestData.tag) {
        case 'youdao': {
          shouldAutoClose = url_ms_map['youdao'] !== requestData.ms
          break
        }
        case 'googleTranslate': {
          shouldAutoClose = url_ms_map['googleTranslate'] !== requestData.ms
          break
        }
        case 'wikitionay': {
          shouldAutoClose = url_ms_map['wikitionay'] !== requestData.ms
          break
        }
        case 'googleDefine': {
          shouldAutoClose = url_ms_map['googleDefine'] !== requestData.ms
          break
        }
        default:
          break
      }
      res.end(
        JSON.stringify({
          shouldAutoClose,
        }),
      )
    } catch (error) {
      console.log('❤️‍🔥')
      console.log(error)
      res.writeHead(500)
      res.end()
    }
  })
}
