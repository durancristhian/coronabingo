import React, { ReactNode } from 'react'
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime'
import { NextRouter } from 'next/router'
import I18nProvider from 'next-translate/I18nProvider'
import { defaultRoomData } from '~/models/room'
import { Room } from '~/interfaces/models/Room'
import es from '~/locales/es/playerId.json'
import en from '~/locales/en/playerId.json'
import enRoom from '~/locales/en/roomId.json'
import esRoom from '~/locales/es/roomId.json'
import enAdmin from '~/locales/en/admin.json'
import esAdmin from '~/locales/es/admin.json'
import enCommon from '~/locales/en/common.json'
import esCommon from '~/locales/es/common.json'

export function roomFixture(changes: Partial<Room> = {}): Room {
  return {
    ...defaultRoomData,
    id: 'room-a',
    ref: {} as Room['ref'],
    ...changes,
  }
}

export function routerFixture(changes: Partial<NextRouter> = {}): NextRouter {
  return {
    basePath: '',
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
    isReady: true,
    isFallback: false,
    isPreview: false,
    isLocaleDomain: false,
    locale: 'en',
    defaultLocale: 'es',
    push: async () => true,
    replace: async () => true,
    reload: () => undefined,
    back: () => undefined,
    forward: () => undefined,
    prefetch: async () => undefined,
    beforePopState: () => undefined,
    events: {
      on: () => undefined,
      off: () => undefined,
      emit: () => undefined,
    },
    ...changes,
  }
}

export function Translation({
  children,
  language = 'en',
  router = routerFixture(),
}: {
  children: ReactNode
  language?: 'en' | 'es'
  router?: NextRouter
}) {
  return (
    <RouterContext.Provider value={router}>
      <I18nProvider
        lang={language}
        namespaces={{
          playerId: language === 'en' ? en : es,
          roomId: language === 'en' ? enRoom : esRoom,
          admin: language === 'en' ? enAdmin : esAdmin,
          common: language === 'en' ? enCommon : esCommon,
        }}
      >
        {children}
      </I18nProvider>
    </RouterContext.Provider>
  )
}
