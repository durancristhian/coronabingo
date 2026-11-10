import React from 'react'
import { FlagsContextProvider } from '~/contexts/Flags'
import { PlayerContextProvider } from '~/contexts/Player'
import { PlayersContextProvider } from '~/contexts/Players'
import { RoomCodeContextProvider } from '~/contexts/RoomCode'
import { RoomContextProvider } from '~/contexts/Room'

const providers = [
  FlagsContextProvider,
  RoomCodeContextProvider,
  PlayerContextProvider,
  PlayersContextProvider,
  RoomContextProvider,
]

interface Props {
  children: JSX.Element
}

const Providers = ({ children: initial }: Props) =>
  providers.reduce((children, Parent) => <Parent>{children}</Parent>, initial)

export default Providers
