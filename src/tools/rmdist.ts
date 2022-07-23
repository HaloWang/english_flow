import * as fs from 'fs'

fs.rmdirSync(process.cwd() + `/dist`, { recursive: true })
