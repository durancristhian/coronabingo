import React, { cloneElement } from 'react'
import { FlagsContextProvider } from '~/contexts/Flags'
import { PlayerContextProvider } from '~/contexts/PlayerContext'
import { PlayersContextProvider } from '~/contexts/PlayersContext'
import { RoomContextProvider } from '~/contexts/RoomContext'

const providers = [
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
