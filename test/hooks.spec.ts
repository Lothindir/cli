/*
 * dimer-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import * as test from 'japa'
import hooks from '../src/services/hooks'
import { IHookTypes } from '../src/contracts'

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

test.group('Hooks', (group) => {
  group.beforeEach(() => {
    hooks.clear()
  })

  test('add before hook', (assert) => {
    const fn = function fn () {}
    hooks.before(IHookTypes.COMPILE, fn)

    assert.deepEqual(hooks['hooks'].compile, {
      before: [fn],
      after: [],
    })
  })

  test('add after hook', (assert) => {
    const fn = function fn () {}
    hooks.after(IHookTypes.COMPILE, fn)

    assert.deepEqual(hooks['hooks'].compile, {
      before: [],
      after: [fn],
    })
  })

  test('add after hook', (assert) => {
    const fn = function fn () {}
    hooks.after(IHookTypes.COMPILE, fn)

    assert.deepEqual(hooks['hooks'].compile, {
      before: [],
      after: [fn],
    })
  })

  test('run before hooks', async (assert) => {
    let stack = []

    const fn = function fn () {
      stack.push('fn 1')
    }

    hooks.before(IHookTypes.COMPILE, fn)
    await hooks.executeBeforeHooks(IHookTypes.COMPILE, {})

    assert.deepEqual(stack, ['fn 1'])
  })

  test('run all before hooks in sequence', async (assert) => {
    let stack = []

    const fn = async function fn () {
      await sleep(100)
      stack.push('fn 1')
    }

    const fn1 = async function fn () {
      stack.push('fn 2')
    }

    hooks.before(IHookTypes.COMPILE, fn)
    hooks.before(IHookTypes.COMPILE, fn1)

    await hooks.executeBeforeHooks(IHookTypes.COMPILE, {})

    assert.deepEqual(stack, ['fn 1', 'fn 2'])
  })

  test('run all after hooks in sequence', async (assert) => {
    let stack = []

    const fn = async function fn () {
      await sleep(100)
      stack.push('fn 1')
    }

    const fn1 = async function fn () {
      stack.push('fn 2')
    }

    hooks.after(IHookTypes.COMPILE, fn)
    hooks.after(IHookTypes.COMPILE, fn1)

    await hooks.executeAfterHooks(IHookTypes.COMPILE, {})

    assert.deepEqual(stack, ['fn 1', 'fn 2'])
  })
})
