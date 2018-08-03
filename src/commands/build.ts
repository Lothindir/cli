import { Command, flags } from '@oclif/command'
import processDocs from '../services/processDocs'

export default class Build extends Command {
  public static description = 'Compile docs for production'

  public static flags = {
    help: flags.help({ char: 'h' }),
  }

  public async run () {
    await processDocs(process.cwd(), false, {})
  }
}
