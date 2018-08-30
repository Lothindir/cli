/*
* cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import * as Emitter from 'events'
import { IVersion, IConfig } from '../contracts/index'
import processDoc from './processDoc'

export default class Version extends Emitter {
  public total: number
  public processed: number = 0
  public errors: any[] = []

  constructor (private ctx, private zoneSlug: string, private version: IVersion, private tree: any[]) {
    super()
    this.total = this.tree.length
  }

  /**
   * The version no
   */
  get no () {
    return this.version.no
  }

  /**
   * Process all the docs in sequence in a version. Make sure never
   * to parallelize this process, otherwise duplicate docs will
   * be created
   */
  public async process () {
    for (let doc of this.tree) {
      const { errors } = await processDoc(doc, this.zoneSlug, this.version, this.ctx)

      this.processed++
      this.emit('doc:processed')

      this.errors = this.errors.concat(errors)
    }
  }
}
