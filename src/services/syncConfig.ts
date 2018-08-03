/*
* cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import * as ConfigParser from '@dimerapp/config-parser'
import * as utils from '@dimerapp/cli-utils'
import { IConfig } from '../contracts/index'

export default async function syncConfig (ctx): Promise<boolean> {
  const options = Object.assign(ctx.get('configOptions'), { validateDomain: false })
  const parser = new ConfigParser(ctx, options)

  try {
    utils.info('parse config', true)
    const { errors, config }: { errors: string[], config: IConfig } = await parser.parse()

    if (errors.length) {
      utils.configErrors(errors)
      return false
    }

    utils.info('sync config')
    ctx.set('cli', 'config', config)
    await ctx.get('store').syncConfig(config)
    return true
  } catch (error) {
    utils.error(error)
  }
}
