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
  await Promise.all(zonesAndVersions.reduce((result, { slug, versions }) => {
    versions.forEach(({ no }) => {
      utils.info(`creating search index for ${slug}/${no} [${slug.language || 'en'}]`)
      result.push(ctx.get('store').indexVersion(slug, no, slug.language))
    })
    return result
  }, []))
}
