/*
* cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import * as utils from '@dimerapp/cli-utils'

export default async function createSearchIndex (ctx, zonesAndVersions) {
  utils.info('creating search index', true)

  await Promise.all(zonesAndVersions.reduce((result, { slug, versions }) => {
    versions.forEach(({ no }) => {
      result.push(ctx.get('store').indexVersion(slug, no))
    })
    return result
  }, []))
}
