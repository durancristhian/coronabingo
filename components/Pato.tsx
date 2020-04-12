import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, {
  Fragment,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import { EasterEggContext } from '~/contexts/EasterEggContext'
import { SOUNDS, SOUNDS_EXTRAS } from '~/utils/constants'
import Button from './Button'
import Heading from '~/components/Heading'

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
  activeSound: string
  onClick: (s: string) => void
}

export default function Pato({ activeSound, onClick }: Props) {
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
      <Heading type="h2">
        <span
          onClick={tricks}
          role="button"
          tabIndex={0}
          onKeyPress={tricks}
          className="cursor-text focus:outline-none"
        >
          {t('jugar:sounds')}
        </span>
      </Heading>
      <div className="border-gray-300 border-t-2 -mx-4">
        {sounds.map(({ language, name, url }, index) => (
          <div
            key={index}
            className={classnames([
              'border-b-2 border-gray-300 flex items-center justify-between px-4 py-2',
              index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200',
              url === activeSound && 'bg-yellow-200',
            ])}
          >
            <div className="mr-4">
              <Button
                disabled={activeSound !== ''}
                onClick={() => onClick(url)}
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
        ))}
      </div>
    </Fragment>
  )
}
