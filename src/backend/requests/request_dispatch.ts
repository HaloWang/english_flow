import { IncomingMessage, ServerResponse } from 'http'

function request_handle(req: IncomingMessage, res: ServerResponse) {
  switch (req.method) {
    case 'GET': {
      get_handle(req, res)
      break
    }
    case 'POST': {
      post_handle(req, res)
      break
    }
    default:
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(404)
      res.end(
        JSON.stringify({
          msg: 'not deal',
        }),
      )
      break
  }
}

function get_handle(req: IncomingMessage, res: ServerResponse) {
  //
}
function post_handle(req: IncomingMessage, res: ServerResponse) {
  //
  let buffer = ''
  req.on('data', chunk => {
    buffer += chunk
  })
  req.on('end', () => {
    if (req.headers['content-type'] && req.headers['content-type'] === 'application/json') {
      // 直接用个更成熟的框架不好吗...非要自己造...😔
    }
  })
}
