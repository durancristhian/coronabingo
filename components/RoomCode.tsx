import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useState } from 'react'
import { FiLogIn } from 'react-icons/fi'
import Button from '~/components/Button'
import RoomCodeCell from '~/components/RoomCodeCell'
import useRoomCode from '~/hooks/useRoomCode'
import useToast from '~/hooks/useToast'
import { Emojis } from '~/interfaces/custom/Emojis'
import { CODES, ROOM_CODE_LENGTH } from '~/utils/roomCodes'

interface Props {
  roomCode: string
}

export default function RoomCode({ roomCode }: Props) {
  const [emojiCode, setEmojiCode] = useState<(keyof Emojis | null)[]>(
    Array(ROOM_CODE_LENGTH).fill(null),
  )
  const { createToast } = useToast()
  const { login } = useRoomCode()
  const { t } = useTranslation()

  const onClick = (emoji: keyof Emojis | null) => {
    if (emojiCode.includes(emoji)) {
      const index = emojiCode.indexOf(emoji)
      const codeCopy = [...emojiCode]

      codeCopy[index] = null

      setEmojiCode(codeCopy)

      return
    }

    if (emojiCode.some(e => !Boolean(e))) {
      const codeCopy = [...emojiCode]
      const firstEmptyIndex = emojiCode.findIndex(e => e === null)

      codeCopy[firstEmptyIndex] = emoji

      setEmojiCode(codeCopy)

      return
    }
  }

  const submitCode = () => {
    const matches = roomCode === emojiCode.toString()
    createToast(
      matches ? 'common:room-code.success' : 'common:room-code.error',
      matches ? 'success' : 'error',
      2000,
    )
    if (matches) login()
  }

  return (
    <Fragment>
      <p className="mb-4 text-center">{t('common:room-code.title')}</p>
      <div className="flex flex-wrap justify-between">
        {CODES.map((emoji, index) => {
          const isChecked = emojiCode.includes(emoji)

          return (
            <RoomCodeCell
              emoji={emoji}
              index={index}
              isChecked={isChecked}
              key={emoji}
              onClick={onClick}
            />
          )
        })}
      </div>
      <div className="flex flex-wrap justify-between my-8">
        {emojiCode.map((emoji, index) => {
          return (
            <RoomCodeCell
              highlighted
              emoji={emoji}
              index={index}
              isChecked={false}
              key={index}
              onClick={onClick}
            />
          )
        })}
      </div>
      <Button
        aria-label={t('common:room-code.submit')}
        id="submit-code"
        disabled={emojiCode.some(e => !Boolean(e))}
        className="w-full"
        onClick={submitCode}
        iconLeft={<FiLogIn />}
      >
        {t('common:room-code.submit')}
      </Button>
    </Fragment>
  )
}
