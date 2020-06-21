import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import Button from '~/components/Button'
import { TICKET_NUMBERS } from '~/utils'

const knuthShuffle = require('knuth-shuffle').knuthShuffle

interface Props {
  isAdmin: boolean
  onNewNumber: (n: number) => void
  selectedNumbers: number[]
  bingoSpinner: boolean
}

export default function SelectedNumbers({
  isAdmin,
  onNewNumber,
  selectedNumbers,
  bingoSpinner,
}: Props) {
  const enableForAdmin = isAdmin && !bingoSpinner
  const roomNumbers = [...selectedNumbers]

  const onNextButtonClick = () => {
    const missingNumbers = TICKET_NUMBERS.filter(n => !roomNumbers.includes(n))
    const shuffled = knuthShuffle(missingNumbers.slice(0))

    onNewNumber(shuffled[0])
  }

  const { t } = useTranslation()

  return (
    <Fragment>
      {isAdmin && !bingoSpinner && (
        <div className="italic mb-4 text-gray-600 text-xs md:text-sm">
          <p>{t('playerId:no-bingo-spinner-description')}</p>
        </div>
      )}
      {isAdmin && bingoSpinner && (
        <Button
          aria-label={t('playerId:next-number')}
          id="next-number"
          className="mb-4 w-full"
          onClick={onNextButtonClick}
          disabled={roomNumbers.length === 90}
          iconLeft={<FiChevronsRight />}
          iconRight={<FiChevronsLeft />}
        >
          {t('playerId:next-number')}
        </Button>
      )}
      <div className="flex flex-wrap" id="ticket-numbers">
        {TICKET_NUMBERS.map(n => (
          <button
            type="button"
            key={n}
            className={classnames([
              'cursor-default flex items-center justify-center h-8 text-gray-800',
              'focus:outline-none',
              'duration-150 ease-in-out transition',
              selectedNumbers.includes(n) &&
                'bg-green-400 font-medium text-green-800',
              enableForAdmin && 'cursor-pointer focus:shadow-outline',
            ])}
            style={{ width: '10%' }}
            onClick={() => enableForAdmin && onNewNumber(n)}
          >
            <span className="uppercase">{n}</span>
          </button>
        ))}
      </div>
    </Fragment>
  )
}
