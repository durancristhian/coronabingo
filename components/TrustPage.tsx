import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import Box from './Box'
import Heading from './Heading'
import Layout from './Layout'
import {
  publicLinks,
  trustContent,
  TrustPage as TrustPageName,
} from '~/utils/publicContent'

export default function TrustPage({ page }: { page: TrustPageName }) {
  const { lang } = useTranslation()
  const content = trustContent(lang)[page]
  return (
    <Layout>
      <Box>
        <article className="cb-public-prose">
          <Heading>{content.title}</Heading>
          {content.paragraphs.map(paragraph => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <nav
            aria-label={lang === 'en' ? 'More information' : 'Más información'}
          >
            <ul>
              {publicLinks(lang).map(link => (
                <li key={link.url}>
                  <a className="cb-text-link" href={link.url}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </Box>
    </Layout>
  )
}
