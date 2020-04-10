import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import { EasterEggContext } from '~/contexts/EasterEggContext'
import { SOUNDS, SOUNDS_EXTRAS } from '~/utils/constants'
import Button from './Button'

interface Props {
  disabled: boolean
  onClick: (s: string) => void
  soundToPlay: string
}

export default function Pato({ disabled, onClick, soundToPlay }: Props) {
  const { t } = useTranslation()
  const [times, setTimes] = useState(0)
  const { isVisible, setVisibility } = useContext(EasterEggContext)

  useEffect(() => {
    if (times !== 7) return

    setVisibility(true)
  }, [times])

  const tricks = () => {
    if (times < 7) {
      setTimes(t => t + 1)
    }
  }

  const sounds = isVisible ? SOUNDS_EXTRAS : SOUNDS

  return (
    <Fragment>
      <h2 className="font-medium mb-4 text-center text-lg md:text-xl">
        <span
          onClick={tricks}
          role="button"
          tabIndex={0}
          onKeyPress={tricks}
          className="cursor-text focus:outline-none"
        >
          {t('jugar:sounds')}
        </span>
      </h2>
      <div className="border-gray-300 border-t-2 -mx-4">
        {sounds.map(({ language, name, url }, index) => (
          <div
            key={index}
            className={classnames([
              'border-b-2 border-gray-300 flex items-center justify-between px-4 py-2',
              index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200',
              url === soundToPlay && 'bg-yellow-200',
            ])}
          >
            <div className="mr-4">
              <Button disabled={disabled} onClick={() => onClick(url)}>
                <FiPlayCircle />
              </Button>
            </div>
            <div className="flex flex-auto items-center">
              <p className="flex items-center">
                <span className="mr-4 text-xl md:text-2xl">{language}</span>
                <span>{name}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  )
}
