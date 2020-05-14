import React, { Fragment, useState } from 'react'
import RoomCodeCell from '~/components/RoomCodeCell'
import useAdminPassword from '~/hooks/useAdminPassword'
import useToast from '~/hooks/useToast'
import { Emojis } from '~/interfaces'
import { CODES } from '~/utils'
import Button from './Button'

interface Props {
  roomCode: string
}

export default function RoomCode({ roomCode }: Props) {
  const [emojiCode, setEmojiCode] = useState<(keyof Emojis | null)[]>([
    null,
    null,
    null,
  ])
  const { login } = useAdminPassword()
  const { createToast, dismissToast } = useToast()

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
    const userCode = emojiCode.toString()

    if (roomCode === userCode) {
      const toastId = createToast('Código correcto. Espere...', 'success')

      setTimeout(() => {
        dismissToast(toastId)

        login(roomCode, userCode)
      }, 2000)
    } else {
      const toastId = createToast(
        'Código incorrecto. Intenta nuevamente...',
        'error',
      )

      setTimeout(() => {
        dismissToast(toastId)
      }, 2000)
    }
  }

  return (
    <Fragment>
      <p className="mb-4 text-center">Ingresa el código de grupo</p>
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
              key={emoji || index}
              onClick={onClick}
            />
          )
        })}
      </div>
      <Button
        /* TODO */
        aria-label="submit code"
        id="submit-code"
        disabled={emojiCode.some(e => !Boolean(e))}
        className="w-full"
        onClick={submitCode}
      >
        Ingresar
      </Button>
    </Fragment>
  )
}
