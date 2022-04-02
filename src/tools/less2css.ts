import * as fs from 'fs'
import * as less from 'less'

let __DEV__ = process.argv.includes('dev')
const sourceFileName = 'style.less'
const sourcePath = process.cwd() + '/src/page/' + sourceFileName
const targetPath = process.cwd() + '/dist/' + 'style.css'

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

if (__DEV__) {
  console.log('Watching less file')
  __dev()
} else {
  __build()
}

function __dev() {
  function transfrom(path: string) {
    fs.readFile(path, 'utf8', (error, lessString) => {
      error && console.error(error)
      less.render(lessString, { paths: ['./'] }, (err, css) => {
        err && console.error(err)
        if (css) {
          fs.writeFileSync(targetPath, css.css)
        }
      })
    })
  }

  transfrom(sourcePath)
  fs.watch(sourcePath, () => {
    transfrom(sourcePath)
  })
}

async function __build() {
  const lessString = fs.readFileSync(sourcePath, 'utf8')
  const { css: cssString } = await less.render(lessString)
  console.log('✅ less built success!')
  fs.writeFileSync(targetPath, cssString)
}
