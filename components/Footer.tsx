import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { FiCoffee, FiMessageSquare, FiTwitter } from 'react-icons/fi'
import Anchor from '~/components/Anchor'
import Container from '~/components/Container'
import News from '~/components/News'
import Heading from '~/components/Heading'
import {
  publicContact,
  publicPath,
  publicSocialUrl,
  trustContent,
  trustPaths,
} from '~/utils/publicContent'

const TWEETS = [
  '1266490485650198528',
  '1267934678784389121',
  '1246110709005660163',
  '1279431298990379012',
]

export default function Footer() {
  const { t, lang } = useTranslation()

  return (
    <footer className="cb-footer bg-white p-4 shadow">
      <Container size="large">
        <News tweetIds={TWEETS} />
        <div className="cb-footer-meta">
          <section className="cb-footer-group" aria-labelledby="footer-project">
            <Heading type="h3">
              <span id="footer-project">{t('common:footer-project')}</span>
            </Heading>
            <nav aria-labelledby="footer-project">
              <ul className="cb-footer-list">
                <li>
                  <p className="cb-footer-credit">
                    <span>{t('common:made-by')}</span>
                    <Anchor href={publicContact.profileUrl} id="my-twitter">
                      {publicContact.name}
                    </Anchor>
                  </p>
                </li>
                {trustPaths.map(path => (
                  <li key={path}>
                    <a
                      className="cb-text-link"
                      href={publicPath(`/${path}`, lang)}
                    >
                      {trustContent(lang)[path].title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
          <nav className="cb-footer-group" aria-labelledby="footer-participate">
            <Heading type="h3">
              <span id="footer-participate">
                {t('common:footer-participate')}
              </span>
            </Heading>
            <ul className="cb-footer-list">
              <li>
                <Anchor href={publicContact.feedbackUrl} id="feedback-form">
                  <span className="cb-footer-action">
                    <FiMessageSquare aria-hidden="true" />
                    <span>{t('common:feedback-form')}</span>
                  </span>
                </Anchor>
              </li>
              <li>
                <Anchor href={publicSocialUrl} id="coronabingo-twitter">
                  <span className="cb-footer-action">
                    <FiTwitter aria-hidden="true" />
                    <span>{t('common:coronabingo-twitter')}</span>
                  </span>
                </Anchor>
              </li>
              <li>
                <Anchor href="https://cafecito.app/durancristhian" id="donate">
                  <span className="cb-footer-action">
                    <FiCoffee aria-hidden="true" />
                    <span>{t('common:donate')}</span>
                  </span>
                </Anchor>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  )
}
