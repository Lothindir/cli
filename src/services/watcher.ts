/*
* cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import syncConfig from './syncConfig'
import syncedZones from './syncZones'
import * as utils from '@dimerapp/cli-utils'

import syncTree from './syncTree'
import processDoc from './processDoc'

/**
 * Handles config changes and re-process the tree, if versions
 * map is changed
 */
async function handleConfigChanges (ctx, client, event) {
  utils.action('change', 'dimer.json')

  const synced = await syncConfig(ctx)
  if (!synced) {
    return
  }

  const { added, removed, updated } = await syncedZones(ctx)

  /**
   * Remove all versions of removed zones
   */
  removed.forEach((zone) => {
    zone.versions.forEach((version) => {
      client.unwatchVersion(zone.slug, version)
    })
  })

  /**
   * Go over added and updated zones, and remove the removed
   * versions, add the added versions.
   */
  added.concat(updated).forEach((zone) => {
    zone.versions.removed.forEach((version) => {
      client.unwatchVersion(zone.slug, version)
    })

    zone.versions.added.forEach((version) => {
      client.watchVersion(zone.slug, version)
    })
  })

  /**
   * Sync the tree again
   */
  await syncTree(ctx, client)

  /**
   * Persist store: IMPORTANT
   */
  await ctx.get('store').persist()
}

/**
 * Handles the changes or additions for a single doc
 */
async function handleDocChanges (ctx, client, { versions, file }) {
  utils.action('change', `${versions[0].location}/${file.baseName}`)

  /**
   * Process doc for all the versions
   */
  const docs = await Promise.all(versions.map((version) => processDoc(file, version.zoneSlug, version, ctx)))

  const errors = docs.reduce<any[]>((collection, { errors }) => {
    collection = collection.concat(errors)
    return collection
  }, [])

  /**
   * Show errors if any
   */
  if (errors.length) {
    utils.filesErrors(ctx.get('paths').basePath, errors)
    console.log('')
  }

  /**
   * Persist store: IMPORTANT
   */
  await ctx.get('store').persist()
}

/**
 * Removes the doc from the datastore
 */
async function handleDocRemoval (ctx, client, { versions, baseName }) {
  utils.action('remove', `${versions[0].location}/${baseName}`)

  /**
   * Remove doc for all the versions
   */
  await Promise.all(versions.map(({ no, zoneSlug }) => ctx.get('store').removeDoc(zoneSlug, no, baseName)))

  /**
   * Persist store: IMPORTANT
   */
  await ctx.get('store').persist()
}

export default function watcher (ctx, client, onEvent: Function) {
  client.watch(async (event, arg) => {
    try {
      /**
       * Changes in Dimer.json
       */
      if (['change:config', 'add:config'].indexOf(event) > -1) {
        await handleConfigChanges(ctx, client, event)
        onEvent(event, arg)
        return
      }

      if (['change:doc', 'add:doc'].indexOf(event) > -1) {
        await handleDocChanges(ctx, client, arg)
        onEvent(event, arg)
        return
      }

      if (event === 'unlink:doc') {
        await handleDocRemoval(ctx, client, arg)
        onEvent(event, arg)
        return
      }

      if (event === 'unlink:version') {
        const versions = arg.map(({ no }) => no).join(', ')
        utils.attention(`Directory for versions {${versions}} is removed. Remove the reference from config too.`)
        onEvent(event, arg)
        return
      }

      if (event === 'unlink:config') {
        utils.attention('You have pulled the plug (removed dimer.json)')
        onEvent(event, arg)
        process.exit(0)
      }

      if (event === 'error') {
        utils.error(arg)
        process.exit(1)
      }
    } catch (error) {
      utils.error(error)
    }
  })
}
