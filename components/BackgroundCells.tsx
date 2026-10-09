import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useContext, useRef } from 'react'
import { FiCheck } from 'react-icons/fi'
import { COLORS } from '~/components/EmptyCell'
import InputText from '~/components/InputText'
import { BackgroundCellContext } from '~/contexts/BackgroundCell'
import { Cell } from '~/interfaces/contexts/BackgroundCell'
import { getBackgroundSelectedEventParams } from '~/utils/analyticsEvents'
import { getBackgroundAnalyticsValue } from '~/utils/backgroundAnalytics'
import { getBackgroundCellImageUrl } from '~/utils/backgroundCell'
import { BACKGROUND_CELL_VALUES } from '~/utils/constants'
import { logEvent as log } from '~/utils/gtag'

export default function BackgroundCells() {
  const { backgroundCell, setBackgroundCell } = useContext(
    BackgroundCellContext,
  )
  const { lang, t } = useTranslation()
  const customUrlAtFocus = useRef('')
  const customUrlWasSaved = useRef(false)

  const logBackgroundSelected = (selectedBackground: Cell) => {
    log(
      'background_selected',
      getBackgroundSelectedEventParams({
        ...getBackgroundAnalyticsValue(selectedBackground),
        language: lang,
      }),
    )
  }

  const selectPreset = (selectedBackground: Cell) => {
    const changed =
      backgroundCell.type !== selectedBackground.type ||
      backgroundCell.value.toString() !== selectedBackground.value.toString()
    const saved = setBackgroundCell(selectedBackground)

    if (changed && saved) logBackgroundSelected(selectedBackground)
  }

  const customUrl =
    backgroundCell.type === 'url' ? backgroundCell.value.toString() : ''

  return (
    <Fragment>
      <div className="mt-4">
        {BACKGROUND_CELL_VALUES.map(({ analyticsKey, key, type, value }, i) => {
          const firstOrDefault = Array.isArray(value) ? value[0] : value
          const isActive = backgroundCell.value.toString() === value.toString()

          return (
            <button
              key={analyticsKey}
              className={classnames([
                'cb-background-option',
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
                selectPreset({
                  type,
                  value,
                })
              }
            >
              <div
                className={classnames([
                  'cb-background-option-preview',
                  'bg-center bg-contain bg-no-repeat w-16',
                  type === 'color' && COLORS[firstOrDefault],
                ])}
                style={{
                  ...(type === 'img' && {
                    backgroundImage: `url(${getBackgroundCellImageUrl(
                      firstOrDefault,
                    )})`,
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
          onBlur={() => {
            if (
              customUrlWasSaved.current &&
              customUrl.trim() &&
              customUrl !== customUrlAtFocus.current
            ) {
              logBackgroundSelected(backgroundCell)
            }

            customUrlAtFocus.current = customUrl
            customUrlWasSaved.current = false
          }}
          onChange={value => {
            customUrlWasSaved.current = setBackgroundCell({
              type: 'url',
              value: value.split(','),
            })
          }}
          onFocus={() => {
            customUrlAtFocus.current = customUrl
            customUrlWasSaved.current = false
          }}
          value={customUrl}
        />
      </div>
    </Fragment>
  )
}
