/*
* cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import * as utils from '@dimerapp/cli-utils'
import { ISyncedZones, IConfig } from '../contracts/index'

export default async function syncVersions (ctx): Promise<ISyncedZones> {
  utils.info('sync versions')
  return ctx.get('store').syncZones((ctx.get('config') as IConfig).zones)
}
