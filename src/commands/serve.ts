import { Command, flags } from '@oclif/command'
import processDocs from '../services/processDocs'
import * as httpServer from '@dimerapp/http-server'
import * as assetsMiddleware from '@dimerapp/assets-middleware'
import * as utils from '@dimerapp/cli-utils'
import * as WebSocket from 'ws'
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
    const server = createServer().listen(flags.port)
    const ws = new WebSocket.Server({ server })

    /**
     * Expose route for SSE. Make sure to bind route after createServer
     * for inbuilt middleware to take effect.
     */
    router.get('/__events', (req, res) => (sse.subscribe(res)))

    console.log('')
    utils.action('API Server:', apiUrl)

    /**
     * In development, we want master options to dictate the config
     * options.
     */
    const masterOptions = {
      apiUrl,
      assetsUrl: `${apiUrl}/__assets`,
    }

    /**
     * Process docs and publish watcher events via SSE
     */
    await processDocs(basePath, masterOptions, function onEvent (event, doc) {
      if (['change:doc', 'add:doc'].includes(event)) {
        if (!doc.file.metaData) {
          return
        }

        const permalink = doc.file.metaData.permalink
        const version = doc.versions[0].no
        const zone = doc.versions[0].zoneSlug

        ws.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              event: event,
              data: {
                permalink,
                version,
                zone,
              },
            }))
          }
        })
      }

      if (['change:doc', 'add:doc', 'change:config', 'add:config'].indexOf(event) > -1) {
        sse.publish('reload', {})
      }
    })
  }
}
