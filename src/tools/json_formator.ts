const fs = require('fs')

let lastFileString = ''

const filePath = './src/data/dictionary.json'
// const filePath = './src/data/t.txt'

let i = 0
function changeFile() {
  i += 1
  // console.log(i)
  let fileString = fs.readFileSync(filePath, 'utf8')
  if (fileString == lastFileString) {
    return
  }

  const matches = {
    '，': '|',
    '。': '|',
    '；': '|',
    ' ": { "m": ': '": { "m": ',
  }

  let matched = false
  for (const _m of Object.keys(matches)) {
    // console.log(_m)
    if (fileString.includes(_m)) {
      console.log('fire:', _m)
      fileString = fileString.replaceAll(_m, matches[_m])
      matched = true
    }
  }

  if (!matched) {
    return
  }

  console.log('write file')
  fs.writeFileSync(filePath, fileString, { encoding: 'utf8' })

  lastFileString = fileString
}

changeFile()

fs.watchFile(filePath, { encoding: 'utf-8', interval: 333 }, (foo, bar) => {
  changeFile()
})
