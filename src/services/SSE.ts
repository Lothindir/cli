/*
* cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import * as nodeRes from 'node-res'

/**
 * Send server side events via pub/sub
 */
export default class SSE {
  private subscriptions: Set<any>
  private counter: number = 0

  constructor () {
    this.subscriptions = new Set()
    this.counter = 0
  }

  /**
   * Removes the res from the set, when it's closed
   */
  private _bindClose (res) {
    res.on('close', () => {
      this.subscriptions.delete(res)
    })
  }

  /**
   * Write event and data to a given response
   * object
   */
  private _writeTo (res, event, data) {
    res.write('id: ' + this.counter + '\n')
    res.write('event: ' + event + '\n')
    res.write('data: ' + JSON.stringify(data) + '\n\n')
  }

  /**
   * Subscribe to a channel and set initial headers
   */
  public subscribe (res) {
    nodeRes.status(res, 200)
    nodeRes.header(res, 'Content-Type', 'text/event-stream')
    nodeRes.header(res, 'Cache-Control', 'no-cache')
    nodeRes.header(res, 'Connection', 'keep-alive')

    this.subscriptions.add(res)
    this._bindClose(res)

    this.publish('ready', {})
  }

  /**
   * Publish event and data to all connected clients
   */
  public publish (event, data) {
    this.counter++

    /**
     * Do console.log(this.subscriptions.size) to see, if there
     * are any memory leaks
     */
    this.subscriptions.forEach((res) => (this._writeTo(res, event, data)))
  }
}
