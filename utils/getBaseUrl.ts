import Router from 'next/router'
import i18n from '~/i18n.json'

export function getBaseUrl() {
  const lang = Router.locale || i18n.defaultLocale

  return `${window.location.protocol}//${window.location.host}/${lang}`
}
