/*
* cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import * as Context from '@dimerapp/context'
import * as Datastore from '@dimerapp/datastore'
import * as FsClient from '@dimerapp/fs-client'
import * as utils from '@dimerapp/cli-utils'
import syncConfig from './syncConfig'
import syncVersions from './syncVersions'
import syncTree from './syncTree'
import imageProcessor from './imageProcessor'
import watcher from './watcher'
import { IConfig } from '../contracts/index'

export default async function processDocs (basePath: string, configOptions, watcherFn?: Function) {
  const ctx = new Context(basePath)

  try {
    /**
     * Setup store
     */
    const store = new Datastore(ctx)
    ctx.set('cli', 'store', store)
    ctx.set('cli', 'configOptions', configOptions)
    await store.load(true)

    /**
     * Parse config. If `parsed` returns true, then ctx will
     * have config too
     */
    const parsed = await syncConfig(ctx)
    if (!parsed) {
      return
    }

    /**
     * Set markdown options to handle assets, when `detectAssets` is
     * set to true
     */
    const processor = imageProcessor(ctx)
    if ((ctx.get('config') as IConfig).compilerOptions.detectAssets) {
      await processor.img.clean()
      ctx.set('cli', 'markdownOptions', { onUrl: processor.onUrl.bind(processor) })
    }

    /**
     * Sync versions
     */
    const { added } = await syncVersions(ctx)

    /**
     * Setup fsclient and sync files tree
     */
    const client = new FsClient(ctx, added)
    await syncTree(ctx, client)

    /**
     * Persist everything to the datastore
     */
    await store.persist()

    /**
     * Create search index if enabled by end user
     */
    if ((ctx.get('config') as IConfig).compilerOptions.detectAssets) {
      utils.info('create search index', true)
      await Promise.all(added.map(({ no }) => store.indexVersion(no)))
    }

    if (typeof (watcherFn) === 'function') {
      watcher(ctx, client, watcherFn)
    }
  } catch (error) {
    utils.error(error)
  }
}
