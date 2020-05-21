import classnames from 'classnames'
import React from 'react'
import Emoji from '~/components/Emoji'
import { Emojis } from '~/interfaces'

interface Props {
  emoji: keyof Emojis | null
  highlighted?: boolean
  index: number
  isChecked: boolean
  onClick: (emoji: keyof Emojis | null) => void
}

export default function RoomCodeCell({
  emoji,
  highlighted,
  index,
  isChecked,
  onClick,
}: Props) {
  return (
    <div className="w-30" key={index}>
      <fieldset disabled={!emoji}>
        <label
          htmlFor={`${emoji}${index}`}
          className={classnames([
            'bg-gray-100 block border-2 border-gray-300 flex items-center justify-center h-24 py-4 rounded text-center text-xl md:text-2xl',
            'focus-within:outline-none focus-within:shadow-outline',
            'duration-150 ease-in-out transition',
            emoji && 'cursor-pointer',
            index > 2 && 'mt-4',
            isChecked && 'bg-gray-300 border-gray-600',
            highlighted && 'bg-green-100 border-green-400',
          ])}
        >
          <input
            type="checkbox"
            id={`${emoji}${index}`}
            className="visually-hidden"
            onChange={() => onClick(emoji)}
            checked={isChecked}
          />
          {emoji ? <Emoji name={emoji} /> : null}
        </label>
      </fieldset>
    </div>
  )
}
