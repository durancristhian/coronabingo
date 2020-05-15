import React, { cloneElement } from 'react'
import { FlagsContext } from './Flags'

const providers = [FlagsContext.Provider]

interface Props {
  children: JSX.Element
}

const GlobalState = ({ children: initial }: Props) =>
  providers.reduce(
    (children, Parent) => cloneElement(<Parent>{children}</Parent>),
    initial,
  )

export { GlobalState }
