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

import Version from '../src/services/Version'

const basePath = join(__dirname, 'app')

test.group('Version', (group) => {
  group.afterEach(async () => {
    await fs.remove(basePath)
  })

  test('process docs inside a version tree', async (assert) => {
    const ctx = new Context(basePath)
    const store = {
      docs: [],
      saveDoc (zoneSlug, version, filename, doc) {
        this.docs.push({ zoneSlug, version, filename, doc })
      },
    }

    ctx.set('store', 'store', store)

    const version = new Version(ctx, 'api', {
      no: '1.0.0',
      name: '1.0.0',
      default: true,
      depreciated: false,
      draft: false,
    }, [
        {
          baseName: 'foo.md',
          metaData: {},
          fatalMessages: [],
          messages: [],
          contents: 'hello',
        },
     ])

    await version.process()

    assert.deepEqual(store.docs, [
      {
        doc: {
          content: 'hello',
        },
        zoneSlug: 'api',
        filename: 'foo.md',
        version: '1.0.0',
      },
    ])

    assert.equal(version.processed, 1)
    assert.equal(version.total, 1)
  })

  test('do not process when has fatal messages', async (assert) => {
    const ctx = new Context(basePath)
    const store = {
      docs: [],
      saveDoc (version, filename, doc) {
        this.docs.push({ version, filename, doc })
      },
    }

    ctx.set('store', 'store', store)

    const version = new Version(ctx, 'api', {
      no: '1.0.0',
      name: '1.0.0',
      default: true,
      depreciated: false,
      draft: false,
    }, [
      {
        baseName: 'foo.md',
        metaData: {},
        fatalMessages: ['Bad file'],
        messages: ['Bad file'],
        contents: 'hello',
      },
    ])

    await version.process()

    assert.deepEqual(store.docs, [])
    assert.equal(version.processed, 1)
    assert.equal(version.total, 1)
    assert.deepEqual(version.errors, ['Bad file'])
  })

  test('report message and process file if they are not fatal', async (assert) => {
    const ctx = new Context(basePath)
    const store = {
      docs: [],
      saveDoc (zoneSlug, version, filename, doc) {
        this.docs.push({ zoneSlug, version, filename, doc })
      },
    }

    ctx.set('store', 'store', store)

    const version = new Version(ctx, 'api', {
      no: '1.0.0',
      name: '1.0.0',
      default: true,
      depreciated: false,
      draft: false,
    }, [
      {
        baseName: 'foo.md',
        metaData: {},
        fatalMessages: [],
        messages: ['Bad file'],
        contents: 'hello',
      },
    ])

    await version.process()

    assert.deepEqual(store.docs, [
      {
        doc: {
          content: 'hello',
        },
        zoneSlug: 'api',
        filename: 'foo.md',
        version: '1.0.0',
      },
    ])

    assert.equal(version.processed, 1)
    assert.equal(version.total, 1)
    assert.deepEqual(version.errors, ['Bad file'])
  })
})
