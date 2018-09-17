/*
* cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { IConfig } from '../contracts'
import hooks from './hooks'
import * as utils from '@dimerapp/cli-utils'
import { isAbsolute, join } from 'path'

export default function installExtensions (ctx, commandName: string) {
  const extensions = (ctx.get('config') as IConfig).compilerOptions.extensions || []
  hooks.clear()

  extensions.forEach((ext) => {
    if (typeof (ext) === 'string') {
      utils.info(`installing extension ${ext}`)
      ext = require(isAbsolute(ext) ? ext : join(process.cwd(), ext))
    }

    if (typeof (ext) !== 'function') {
      throw new Error('All extensions must export a function')
    }

    ext(hooks, commandName)
  })
}
