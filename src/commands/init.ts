import { Command, flags } from '@oclif/command'
import * as ConfigParser from '@dimerapp/config-parser'
import * as Context from '@dimerapp/context'
import * as utils from '@dimerapp/cli-utils'

export default class Build extends Command {
  public static description = 'Compile docs for production'

  public static flags = {
    help: flags.help({ char: 'h' }),
  }

  public async run () {
    const ctx = new Context(process.cwd())
    const config = new ConfigParser(ctx)

    await config.init()
    utils.info('create dimer.json')
  }
}
