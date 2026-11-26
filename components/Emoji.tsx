import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { Emojis } from '~/interfaces/custom/Emojis'
import emojiLabels from '~/utils/emojiLabels.json'

interface Props {
  name: keyof Emojis
}

/* Twemoji graphics served from public/emojis/; see NOTICE for the license. */
export default function Emoji({ name }: Props) {
  const { t } = useTranslation()

  return (
    <img
      src={`/emojis/${name}.svg`}
      alt={t(emojiLabels[name])}
      className="cb-emoji"
      width={36}
      height={36}
      decoding="async"
      draggable={false}
    />
  )
}
