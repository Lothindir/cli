import { Command, flags } from '@oclif/command'
import processDocs from '../services/processDocs'
import * as httpServer from '@dimerapp/http-server'
import * as assetsMiddleware from '@dimerapp/assets-middleware'
import * as utils from '@dimerapp/cli-utils'

export default class Serve extends Command {
  public static description = 'Compile and serve markdown over HTTP server'

  public static flags = {
    help: flags.help({char: 'h'}),
    port: flags.string({
      char: 'p',
      description: 'Http port to listen',
      default: '5000',
      required: false,
    }),
  }

  public async run () {
    const { flags } = this.parse(Serve)
    const basePath = process.cwd()
    const { router, createServer } = httpServer()

    router.use(assetsMiddleware(basePath))
    router.use((req, res, next) => {
      req.basePath = basePath
      next()
    })

    const apiUrl = `http://localhost:${flags.port}`
    createServer().listen(flags.port)

    console.log('')
    utils.action('API Server:', apiUrl)

    await processDocs(basePath, true, { apiUrl })
  }
}
