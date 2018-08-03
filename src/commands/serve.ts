import { Command, flags } from '@oclif/command'
import processDocs from '../services/processDocs'
import * as httpServer from '@dimerapp/http-server'
import * as utils from '@dimerapp/cli-utils'

export default class Serve extends Command {
  public static description = 'Compile and serve markdown over HTTP server'

  public static flags = {
    help: flags.help({char: 'h'}),
  }

  public async run () {
    const basePath = process.cwd()
    const { router, createServer } = httpServer()

    router.use((req, res, next) => {
      req.basePath = basePath
      next()
    })

    createServer().listen(5000)

    console.log('')
    utils.action('HTTP', 'Started on http://localhost:5000')

    await processDocs(basePath, true)
  }
}
