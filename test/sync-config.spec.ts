/*
* cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import * as test from 'japa'
import * as Context from '@dimerapp/context'
import { join } from 'path'
import * as fs from 'fs-extra'
import * as intercept from 'intercept-stdout'

import syncConfig from '../src/services/syncConfig'

const basePath = join(__dirname, 'app')

const interceptor = {
  start () {
    let log = { message: null }
    const stop = intercept((message) => {
      log.message = message
      return ''
    })
    return { stop, log }
  },
}

test.group('Sync config', (group) => {
  group.afterEach(async () => {
    await fs.remove(basePath)
  })

  test('print errors when config file is missing', async (assert) => {
    const { stop, log } = interceptor.start()

    const ctx = new Context(basePath)
    await syncConfig(ctx)
    stop()

    assert.match(log.message, /Cannot find dimer\.json file/)
    assert.isUndefined(ctx.get('config'))
  })

  test('print config errors', async (assert) => {
    const ctx = new Context(basePath)
    await fs.outputJSON(ctx.get('paths').configFile(), {})

    const { stop, log } = interceptor.start()

    await syncConfig(ctx)
    stop()

    assert.match(log.message, /Missing version\(s\) in config/)
    assert.isUndefined(ctx.get('config'))
  })

  test('set config in context and store', async (assert) => {
    const ctx = new Context(basePath)

    const store = {
      config: null,
      syncConfig (config) {
        this.config = config
      },
    }
    ctx.set('store', 'store', store)

    await fs.outputJSON(ctx.get('paths').configFile(), {
      versions: {
        '1.0.0': 'docs/1.0.0',
      },
    })

    const { stop } = interceptor.start()
    await syncConfig(ctx)
    stop()

    assert.deepEqual(ctx.get('config'), {
      cname: '',
      domain: '',
      zones: [{
        slug: 'default',
        name: 'default',
        versions: [{ no: '1.0.0', location: 'docs/1.0.0', default: true }]
      }],
      websiteOptions: {},
      compilerOptions: {
        apiUrl: 'http://localhost:5000',
        assetsUrl: 'http://localhost:5000/__assets',
        createSearchIndex: true,
        detectAssets: true,
      },
    })
  })
})
