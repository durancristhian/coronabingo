import classnames from 'classnames'
import { Fragment } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { BOARD_NUMBERS } from '~/utils/constants'
import Button from './Button'
const knuthShuffle = require('knuth-shuffle').knuthShuffle

interface IProps {
  isAdmin: boolean
  onNewNumber: (n: number) => void
  selectedNumbers: number[]
  turningGlob: boolean
}

export default function SelectedNumbers({
  isAdmin,
  onNewNumber,
  selectedNumbers,
  turningGlob
}: IProps) {
  const enableForAdmin = isAdmin && !turningGlob
  const roomNumbers = [...selectedNumbers]

  const onNextButtonClick = () => {
    const missingNumbers = BOARD_NUMBERS.filter(n => !roomNumbers.includes(n))
    const shuffled = knuthShuffle(missingNumbers.slice(0))

    onNewNumber(shuffled[0])
  }

  const { t } = useTranslation()

  return (
    <Fragment>
      {isAdmin && !turningGlob && (
        <div className="italic leading-normal mb-4 text-gray-600 text-sm">
          <p>{t('jugar:no-turningglob-description')}</p>
        </div>
      )}
      {isAdmin && turningGlob && (
        <Button
          id="next"
          className="mb-4 w-full"
          onClick={onNextButtonClick}
          disabled={roomNumbers.length === 90}
        >
          {t('jugar:next-number')}
        </Button>
      )}
      <div className="flex flex-wrap">
        {BOARD_NUMBERS.map((n, i) => (
          <button
            type="button"
            key={n}
            className={classnames([
              'cursor-default flex items-center justify-center h-8 text-gray-600',
              'focus:outline-none',
              'duration-150 ease-in-out transition',
              selectedNumbers.includes(n) &&
                'bg-green-400 font-medium text-green-800',
              enableForAdmin && 'cursor-pointer focus:shadow-outline'
            ])}
            style={{ width: '10%' }}
            onClick={() => enableForAdmin && onNewNumber(n)}
          >
            <span className="font-oswald uppercase">{n}</span>
          </button>
        ))}
      </div>
    </Fragment>
  )
}
