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

import syncVersions from '../src/services/syncVersions'

const basePath = join(__dirname, 'app')

const interceptor = {
  start () {
    let log = { message: null }
    const stop = intercept((message) => {
      log.message = message
      return ''
    })
    return { stop, log }
  }
}

test.group('Sync config', (group) => {
  group.afterEach(async () => {
    await fs.remove(basePath)
  })

  test('sync versions with store', async (assert) => {
    const store = {
      versions: null,
      syncVersions (versions) {
        this.versions = versions
      },
    }

    const ctx = new Context(basePath)
    ctx.set('store', 'store', store)
    ctx.set('config', 'config', {
      versions: [{ location: 'docs/1.0.0', no: '1.0.0' }]
    })

    const { stop, log } = interceptor.start()
    await syncVersions(ctx)
    stop()

    assert.deepEqual(store.versions, [{ location: 'docs/1.0.0', no: '1.0.0' }])
  })
})
