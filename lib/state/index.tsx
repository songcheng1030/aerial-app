import React from 'react'

export * from './action'
export * from './docs'
export * from './history'
export * from './people'

/**
 * A stub entry for when we make UX interactive again
 */
export const StateProvider: React.FC = ({ children }) => <>{children}</>
