import { Command, flags } from '@oclif/command'
import processDocs from '../services/processDocs'
import * as httpServer from '@dimerapp/http-server'
import * as assetsMiddleware from '@dimerapp/assets-middleware'
import * as utils from '@dimerapp/cli-utils'
import SSE from '../services/SSE'

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
    const sse = new SSE()

    /**
     * Serve assets
     */
    router.use(assetsMiddleware(basePath))

    /**
     * Define base path
     */
    router.use((req, res, next) => {
      req.basePath = basePath
      next()
    })

    const apiUrl = `http://localhost:${flags.port}`
    createServer().listen(flags.port)

    /**
     * Expose route for SSE. Make sure to bind route after createServer
     * for inbuilt middleware to take effect.
     */
    router.get('/__events', (req, res) => (sse.subscribe(res)))

    console.log('')
    utils.action('API Server:', apiUrl)

    /**
     * Process docs and publish watcher events via SSE
     */
    await processDocs(basePath, { apiUrl }, function onEvent (event) {
      if (['change:doc', 'add:doc', 'change:config', 'add:config'].indexOf(event) > -1) {
        sse.publish('reload', {})
      }
    })
  }
}
