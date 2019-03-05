/*
* cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import Version from './Version'
import * as utils from '@dimerapp/cli-utils'

export default async function syncTree (ctx, client) {
  const tree = await client.tree()

  /**
   * The versions returned from the fsclient tree, has
   * zoneSlug attached to them as property. So we
   * can use that to initiate a new Version
   * instance.
   */
  const versions: Version[] = tree.map((node) => new Version(ctx, node.version.zoneSlug, node.version, node.tree))

  /**
   * Process all versions in parallel
   */
  await Promise.all(versions.map((version) => {
    version.on('doc:processed', () => (utils.versionsProgress(versions)))
    return version.process()
  }))

  /**
   * Clear the progress bar created for versions. This is required
   * to write to new lines
   */
  utils.versionsProgressClear()

  /**
   * Print errors if any
   */
  const errors = versions.reduce<any[]>((collection, { errors }) => {
    collection = collection.concat(errors)
    return collection
  }, [])

  if (errors.length) {
    utils.filesErrors(ctx.get('paths').basePath, errors)
    console.log('')
  }
}
