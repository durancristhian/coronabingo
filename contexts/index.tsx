import React, { cloneElement } from 'react'
import { ProvideAuth } from '~/contexts/Auth'
import { FlagsContextProvider } from '~/contexts/Flags'
import { PlayerContextProvider } from '~/contexts/Player'
import { PlayersContextProvider } from '~/contexts/Players'
import { RoomContextProvider } from '~/contexts/Room'

const providers = [
  ProvideAuth,
  FlagsContextProvider,
  RoomContextProvider,
  PlayersContextProvider,
  PlayerContextProvider,
]

interface Props {
  children: JSX.Element
}

const Providers = ({ children: initial }: Props) =>
  providers.reduce(
    (children, Parent) => cloneElement(<Parent>{children}</Parent>),
    initial,
  )

export default Providers
