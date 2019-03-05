/*
 * dimer-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { IHookTypes } from '../contracts'

/**
 * Manages app hooks
 */
class Hooks {
  private hooks: { [key in IHookTypes]: { before: Function[], after: Function[] } } = {
    [IHookTypes.COMPILE]: {
      before: [],
      after: [],
    },
    [IHookTypes.DOC]: {
      before: [],
      after: [],
    },
  }

  /**
   * Register before hook
   */
  public before (event: IHookTypes, fn: Function): this {
    this.hooks[event].before.push(fn)
    return this
  }

  /**
   * Register after hook
   */
  public after (event: IHookTypes, fn: Function): this {
    this.hooks[event].after.push(fn)
    return this
  }

  /**
   * Execute all before hooks in sequence
   */
  public async executeBeforeHooks (event: IHookTypes, data: any) {
    for (let hook of this.hooks[event].before) {
      await hook(data)
    }
  }

  /**
   * Execute all after hooks in sequence
   */
  public async executeAfterHooks (event: IHookTypes, data: any) {
    for (let hook of this.hooks[event].after) {
      await hook(data)
    }
  }

  /**
   * Clear all registered hooks
   */
  public clear () {
    this.hooks = {
      [IHookTypes.COMPILE]: {
        before: [],
        after: [],
      },
      [IHookTypes.DOC]: {
        before: [],
        after: [],
      },
    }
  }
}

export default new Hooks()
