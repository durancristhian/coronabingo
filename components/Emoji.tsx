import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'

interface Emojis {
  'flag-ar': string
  us: string
}

const emojiCSS: Emojis = {
  'flag-ar': 'em-flag-ar',
  us: 'em-us',
}

/* TODO */
const emojiLabel: Emojis = {
  'flag-ar': 'common:copy',
  us: 'common:copy',
}

interface Props {
  name: keyof Emojis
}

export default function Emoji({ name }: Props) {
  const { t } = useTranslation()

  return (
    <i
      className={classnames(['em', emojiCSS[name]])}
      tabIndex={-1}
      aria-label={t(emojiLabel[name])}
    ></i>
  )
}
