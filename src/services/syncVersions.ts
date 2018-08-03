/*
* cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import * as utils from '@dimerapp/cli-utils'
import { ISyncedVersions } from '../contracts/index'

export default async function syncVersions (ctx): Promise<ISyncedVersions> {
  utils.info('sync versions')
  console.log('')
  return ctx.get('store').syncVersions(ctx.get('config').versions)
}
