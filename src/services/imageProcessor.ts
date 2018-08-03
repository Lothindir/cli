/*
* cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import * as Image from '@dimerapp/image'
import * as utils from '@dimerapp/cli-utils'
import { dirname } from 'path'
import * as prettyBytes from 'pretty-bytes'

export default function imageProcessor (ctx): { img, onUrl } {
  const img = new Image(ctx)

  return {
    img: img,
    async onUrl (url, file) {
      if (!this.img.isImage(url)) {
        return
      }

      try {
        const response = await this.img.move(url, dirname(file.path))

        /**
         * Log when processing a new file
         */
        if (!response.cache) {
          utils.wrapInBraces(`Processed ${url}`, prettyBytes(response.size))
        }

        return this.img.toDimerNode(response)
      } catch (error) {
        const message = file.message(error.code === 'ENOENT' ? `Broken reference ${url}` : error.message)
        message.ruleId = error.code === 'ENOENT' ? 'broken-img-ref' : error.ruleId
      }
    },
  }
}
