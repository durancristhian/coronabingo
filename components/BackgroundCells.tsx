import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useContext } from 'react'
import { COLORS } from '~/components/EmptyCell'
import { BackgroundCellContext } from '~/contexts/BackgroundCellContext'
import { BACKGROUND_CELL_VALUES } from '~/utils/constants'
import InputText from './InputText'
import Heading from '~/components/Heading'

export default function BackgroundCells() {
  const { backgroundCell, setBackgroundCell } = useContext(
    BackgroundCellContext,
  )
  const { t } = useTranslation()
  return (
    <Fragment>
      <Heading type="h2">{t('jugar:empty-cells.title')}</Heading>
      <div className="flex flex-wrap">
        {BACKGROUND_CELL_VALUES.map(({ key, type, value }, i) => {
          const firstOrDefault = Array.isArray(value) ? value[0] : value
          const isChecked = backgroundCell.value.toString() === value.toString()
          return (
            <div className="pb-4 pr-4 w-32" key={value.toString()}>
              <label
                htmlFor={i.toString()}
                className={classnames([
                  'bg-gray-100 block border-2 border-gray-300 cursor-pointer px-4 py-2 rounded',
                  'focus-within:outline-none focus-within:shadow-outline',
                  'duration-150 ease-in-out transition',
                  isChecked && 'bg-gray-300 border-gray-600',
                ])}
              >
                <input
                  type="radio"
                  name="background"
                  id={i.toString()}
                  className="visually-hidden"
                  onChange={() =>
                    setBackgroundCell({
                      type,
                      value,
                    })
                  }
                  checked={isChecked}
                />
                <div
                  className={classnames([
                    'bg-center bg-contain bg-no-repeat h-16 mb-2 w-full',
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
                <p className="italic text-center truncate">{t(key)}</p>
              </label>
            </div>
          )
        })}
      </div>
      <div className="-mb-4">
        <InputText
          id="background"
          label={t('jugar:empty-cells.url')}
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
