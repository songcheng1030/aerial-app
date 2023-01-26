import { createReactQueryHooks } from '@trpc/react'
import type { AppRouter } from './trpc.back'

export type { AppRouter } from './trpc.back'

export const trpc = createReactQueryHooks<AppRouter>()
