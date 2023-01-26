import * as trpcNext from '@trpc/server/adapters/next'
import { appRouter } from '../../../lib/trpc.back'

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
})
