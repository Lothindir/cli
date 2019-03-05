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
import * as Dfile from '@dimerapp/dfile'
import * as utils from '@dimerapp/cli-utils'
import syncConfig from './syncConfig'
import syncZones from './syncZones'
import syncTree from './syncTree'
import imageProcessor from './imageProcessor'
import watcher from './watcher'
import { IConfig, IHookTypes } from '../contracts/index'
import hooks from './hooks'
import createSearchIndex from './createSearchIndex'
import installExtensions from './installExtensions'

export default async function processDocs (basePath: string, masterOptions, watcherFn?: Function) {
  const ctx = new Context(basePath)

  try {
    /**
     * Setup store
     */
    const store = new Datastore(ctx)
    ctx.set('cli', 'store', store)
    ctx.set('cli', 'masterOptions', masterOptions)
    await store.load(true)

    /**
     * Parse config. If `parsed` returns true, then ctx will
     * have config too
     */
    const parsed = await syncConfig(ctx)
    if (!parsed) {
      process.exit(1)
    }

    /**
     * Installing extensions
     */
    installExtensions(ctx, watcherFn ? 'serve' : 'build')

    /**
     * Execute before compile hooks
     */
    await hooks.executeBeforeHooks(IHookTypes.COMPILE, {
      config: ctx.get('config'),
      Markdown: Dfile.Markdown,
    })

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
    const { added, updated } = await syncZones(ctx)

    /**
     * We pull versions from the added and the updated zones and
     * re-create a new nested array.
     *
     * In short these are the one's which exists in the user config.
     */
    const zonesAndVersions = added.concat(updated).map((zone) => {
      const versions = zone.versions.added.concat(zone.versions.updated)
      return { slug: zone.slug, versions }
    }, [])

    /**
     * Setup fsclient and sync files tree
     */
    const client = new FsClient(ctx, zonesAndVersions)
    await syncTree(ctx, client)

    /**
     * Persist everything to the datastore
     */
    await store.persist()

    /**
     * Create search index
     */
    await createSearchIndex(ctx, zonesAndVersions)

    /**
     * Execute after hooks
     */
    await hooks.executeAfterHooks(IHookTypes.COMPILE, {})

    /**
     * Start the watcher, when watcherFn is provided. Also all
     * events will be forwarded to the watcherFn too.
     */
    if (typeof (watcherFn) === 'function') {
      utils.info('watching for file changes')
      watcher(ctx, client, watcherFn)
    }
  } catch (error) {
    utils.error(error)
    process.exit(1)
  }
}
