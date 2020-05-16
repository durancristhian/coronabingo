import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useContext } from 'react'
import { FiCheck } from 'react-icons/fi'
import { COLORS } from '~/components/EmptyCell'
import InputText from '~/components/InputText'
import { BackgroundCellContext } from '~/contexts/BackgroundCell'
import { BACKGROUND_CELL_VALUES } from '~/utils'

export default function BackgroundCells() {
  const { backgroundCell, setBackgroundCell } = useContext(
    BackgroundCellContext,
  )
  const { t } = useTranslation()

  return (
    <Fragment>
      <div className="mt-4">
        {BACKGROUND_CELL_VALUES.map(({ key, type, value }, i) => {
          const firstOrDefault = Array.isArray(value) ? value[0] : value
          const isActive = backgroundCell.value.toString() === value.toString()

          return (
            <button
              key={i}
              className={classnames([
                'flex items-center justify-between w-full',
                'focus:outline-none focus:bg-gray-400 hover:bg-gray-400',
                'duration-150 ease-in-out transition',
                isActive
                  ? 'bg-green-200'
                  : i % 2 === 0
                  ? 'bg-gray-100'
                  : 'bg-gray-200',
              ])}
              onClick={() =>
                setBackgroundCell({
                  type,
                  value,
                })
              }
            >
              <div
                className={classnames([
                  'bg-center bg-contain bg-no-repeat h-16 w-16',
                  type === 'color' && COLORS[firstOrDefault],
                ])}
                style={{
                  ...(type === 'img' && {
                    backgroundImage: `url(/background-cells/${firstOrDefault})`,
                  }),
                  ...(type === 'url' && {
                    backgroundImage: `url(${firstOrDefault})`,
                  }),
                }}
              ></div>
              <div className="flex flex-auto items-center mx-4">
                <p className="text-center truncate">{t(key)}</p>
              </div>
              <div className="mr-4">
                {isActive && <FiCheck className="text-xl" />}
              </div>
            </button>
          )
        })}
      </div>
      <div className="-mb-4">
        <InputText
          id="background"
          label={t('playerId:empty-cells.url')}
          onChange={value => {
            setBackgroundCell({
              type: 'url',
              value: value.split(','),
            })
          }}
          value={
            (backgroundCell.type === 'url' &&
              backgroundCell.value.toString()) ||
            ''
          }
        />
      </div>
    </Fragment>
  )
}
