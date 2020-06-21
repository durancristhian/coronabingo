import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import { FiFrown, FiSmile } from 'react-icons/fi'
import Button from '~/components/Button'
import { confettiTypes } from '~/components/Confetti'
import { ConfettiType, Room } from '~/interfaces'
import roomApi from '~/models/room'

interface Props {
  room: Room
}

export default function Celebrations({ room }: Props) {
  const { t } = useTranslation()

  return (
    <Fragment>
      {confettiTypes.map((ct, i) => (
        <div key={ct} className={classnames([i !== 0 && 'mt-4'])}>
          <Button
            aria-label={
              room.confettiType
                ? t(`playerId:hide-${ct}`)
                : t(`playerId:show-${ct}`)
            }
            id={`click-${ct}`}
            color={ct === room.confettiType ? 'red' : 'green'}
            onClick={() =>
              roomApi.updateRoom(room.ref, {
                confettiType:
                  ct === room.confettiType ? '' : (ct as ConfettiType),
              })
            }
            className="w-full"
            iconLeft={ct === room.confettiType ? <FiFrown /> : <FiSmile />}
          >
            {ct === room.confettiType ? (
              <span className="truncate">{t(`playerId:hide-${ct}`)}</span>
            ) : (
              <span className="truncate">{t(`playerId:show-${ct}`)}</span>
            )}
          </Button>
        </div>
      ))}
    </Fragment>
  )
}
