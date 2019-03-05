/*
* cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { IVersion, IHookTypes } from '../contracts/index'
import hooks from './hooks'

/**
 * Process a given file at a time, if there are fatal messages, they will be returned
 * as an array.
 */
export default async function processDoc (
  file: any,
  zoneSlug: string,
  version: IVersion,
  ctx: any): Promise<{ errors: any[] }> {
  /**
   * Do not process when there are fatal error message, however
   * return all errors and warning.
   */
  if (file.fatalMessages.length) {
    return { errors: file.messages }
  }

  try {
    const doc = Object.assign({ content: file.contents }, file.metaData)

    /**
     * Execute the before hook
     */
    await hooks.executeBeforeHooks(IHookTypes.DOC, {
      doc,
      zoneSlug,
      versionNo: version.no,
      path: file.vfile.path,
    })

    await ctx.get('store').saveDoc(zoneSlug, version.no, file.baseName, doc)

    /**
     * Execute the after hook
     */
    await hooks.executeAfterHooks(IHookTypes.DOC, {
      doc,
      zoneSlug,
      versionNo: version.no,
      path: file.vfile.path,
    })

    /**
     * Since we save the file with non fatal errors, we still have to return
     * errors which are plain warnings
     */
    return { errors: file.messages }
  } catch (error) {
    file.fatalMessage(error.message, error.ruleId)
    return { errors: file.messages }
  }
}
