import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import { FiFrown, FiSmile } from 'react-icons/fi'
import { ConfettiType, Room } from '~/interfaces'
import roomApi from '~/models/room'
import Button from './Button'
import { confettiTypes } from './Confetti'

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
            id={`click-${ct}`}
            color={ct === room.confettiType ? 'red' : 'green'}
            onClick={() =>
              roomApi.updateRoom(room.ref, {
                confettiType:
                  ct === room.confettiType ? '' : (ct as ConfettiType),
              })
            }
            className="w-full"
          >
            {ct === room.confettiType ? (
              <Fragment>
                <FiFrown />
                <span className="ml-4 truncate">{t(`jugar:hide-${ct}`)}</span>
              </Fragment>
            ) : (
              <Fragment>
                <FiSmile />
                <span className="ml-4 truncate">{t(`jugar:show-${ct}`)}</span>
              </Fragment>
            )}
          </Button>
        </div>
      ))}
    </Fragment>
  )
}
