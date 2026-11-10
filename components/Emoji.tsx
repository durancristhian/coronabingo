import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { Emojis } from '~/interfaces/custom/Emojis'
import emojiLabels from '~/utils/emojiLabels.json'

interface Props {
  name: keyof Emojis
}

export default function Emoji({ name }: Props) {
  const { t } = useTranslation()

  return (
    <i
      className={classnames(['em outline-none', `em-${name}`])}
      tabIndex={-1}
      aria-label={t(emojiLabels[name])}
    ></i>
  )
}
