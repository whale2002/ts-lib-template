import { execa } from 'execa'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import jsonfile from 'jsonfile'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function getPkgVersion() {
  const { version } = await jsonfile.readFile(
    resolve(__dirname, '../package.json'),
  )
  return `v${version}`
}

async function run() {
  await execa('pnpm', ['i'], { stdio: 'inherit' })
  await execa('pnpm', ['build'], { stdio: 'inherit' })
  await execa('pnpm', ['run', 'changeset:version'], { stdio: 'inherit' })
  const version = await getPkgVersion()
  await execa('git', ['tag', '-a', version, '-m', version], {
    stdio: 'inherit',
  })
  await execa('git', ['push', 'origin', version], { stdio: 'inherit' })
}

run()
