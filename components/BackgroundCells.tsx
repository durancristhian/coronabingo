import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useContext } from 'react'
import { BackgroundCellContext } from '~/contexts/BackgroundCellContext'
import { BACKGROUND_CELL_VALUES } from '~/utils/constants'
import InputText from './InputText'

export default function BackgroundCells() {
  const { backgroundCell, setBackgroundCell } = useContext(
    BackgroundCellContext,
  )
  const { t } = useTranslation()
  return (
    <Fragment>
      <h2 className="font-medium mb-4 text-center text-lg md:text-xl">
        {t('jugar:empty-cells.title')}
      </h2>
      <div className="flex flex-wrap">
        {BACKGROUND_CELL_VALUES.map((bc, i) => (
          <div className="pb-4 pr-4 w-32" key={bc.value}>
            <label
              htmlFor={i.toString()}
              className={classnames([
                'bg-gray-100 block border-2 border-gray-300 cursor-pointer px-4 py-2 rounded',
                'focus-within:outline-none focus-within:shadow-outline',
                'duration-150 ease-in-out transition',
                backgroundCell.value === bc.value &&
                  'bg-gray-300 border-gray-600',
              ])}
            >
              <input
                type="radio"
                name="background"
                id={i.toString()}
                className="visually-hidden"
                onChange={() =>
                  setBackgroundCell({
                    type: bc.type,
                    value: bc.value,
                  })
                }
                checked={backgroundCell.value === bc.value}
              />
              <div
                className={classnames([
                  'bg-center bg-contain bg-no-repeat h-16 mb-2 w-full',
                  bc.type === 'color' &&
                    ((bc.value === 'blue' && 'bg-blue-300') ||
                      (bc.value === 'green' && 'bg-green-300') ||
                      (bc.value === 'orange' && 'bg-orange-300') ||
                      (bc.value === 'yellow' && 'bg-yellow-300')),
                ])}
                style={{
                  ...(bc.type === 'img' && {
                    backgroundImage: `url(/background-cells/${bc.value})`,
                  }),
                  ...(bc.type === 'url' && {
                    backgroundImage: `url(${bc.value})`,
                  }),
                }}
              ></div>
              <p className="italic text-center">{t(bc.key)}</p>
            </label>
          </div>
        ))}
      </div>
      <div className="-mb-4">
        <InputText
          id="background"
          label={t('jugar:empty-cells.url')}
          onChange={value => {
            setBackgroundCell({
              type: 'url',
              value,
            })
          }}
          value={(backgroundCell.type === 'url' && backgroundCell.value) || ''}
        />
      </div>
    </Fragment>
  )
}
