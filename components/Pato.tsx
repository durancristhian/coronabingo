import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { ReactNode } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import { Room } from '~/interfaces'
import roomApi from '~/models/room'
import { SOUNDS, SOUNDS_EXTRAS } from '~/utils/constants'
import Button from './Button'

/* TODO: this should be in constants */
const emojis: { [key: string]: ReactNode } = {
  ar: (
    <i className="em em-flag-ar" tabIndex={-1} aria-label="Argentina Flag"></i>
  ),
  en: (
    <i className="em em-us" tabIndex={-1} aria-label="United States Flag"></i>
  ),
  world: (
    <i
      className="em em-earth_americas"
      tabIndex={-1}
      aria-label="Earth globe americas"
    ></i>
  ),
}

interface Props {
  extraSounds: boolean
  room: Room
}

export default function Pato({ extraSounds, room }: Props) {
  const { t } = useTranslation()

  const sounds = extraSounds ? SOUNDS_EXTRAS : SOUNDS

  return (
    <div className="border-gray-300 border-t-2 -mx-4">
      {sounds.map(({ language, name, url }, index) => {
        return (
          <div
            key={index}
            className={classnames([
              'border-b-2 border-gray-300 flex items-center justify-between px-4 py-2',
              index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200',
              room.soundToPlay === url && 'bg-yellow-200',
            ])}
          >
            <div className="mr-4">
              <Button
                id="play-sound"
                aria-label={t('jugar:play-sound', { name })}
                disabled={!!room.soundToPlay}
                onClick={() => {
                  roomApi.updateRoom(room.ref, {
                    soundToPlay: url,
                  })
                }}
              >
                <FiPlayCircle />
              </Button>
            </div>
            <div className="flex flex-auto items-center">
              <p className="flex items-center">
                <span>{emojis[language]}</span>
                <span className="ml-4">{name}</span>
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
