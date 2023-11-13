import Bottle from 'bottlejs'

import registerCore from './registry/registerCore'
import registerServices from './registry/registerServices'
import registerUseCases from './registry/registerUseCases'

/**
 * A services container.
 *
 * import it as `bottle`, then call `bottle.container.ServiceName`
 * to get the `ServiceName` instance.
 *
 * NOTE: don't forget to call `initBottle()` before use it.
 *
 * Usecases:
 * ```ts
 * import bottle, {initBottle} from 'src/infrastructures/bottle'
 *
 * initBottle() // register services
 *
 * bottle.container.LoginUser // get LoginUser instance
 * ```
 */
const bottle = new Bottle()

/**
 * Register services into bottle.
 */
export const initBottle = (): void => {
  registerServices()
  registerCore()
  registerUseCases()
}

export default bottle
