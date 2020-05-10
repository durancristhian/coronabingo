import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import matter from 'gray-matter'
import Modal from '~/components/Modal'
import { version } from '~/package.json'
import { defaultLanguage } from '~/i18n.json'
import DynamicNamespaces from 'next-translate/DynamicNamespaces'
import Trans from 'next-translate/Trans'

type Changelog = {
  changelog: {
    [key: string]: string
  }
  lang: string
}

export default function NewsModal(props?: Changelog) {
  const [showNewsModal, setShowNewsModal] = useState(false)

  useEffect(() => {
    const currentVersion = localStorage.getItem('bingoVersion')

    if (version !== currentVersion) {
      setShowNewsModal(true)
    }
  }, [])

  const closeNewsModal = () => {
    localStorage.setItem('bingoVersion', version)
    setShowNewsModal(false)
  }

  return (
    <DynamicNamespaces
      dynamic={() =>
        import(`../locales/${props?.lang}/index.json`).then(m => m.default)
      }
      namespaces={['dynamic']}
    >
      <Modal
        isOpen={showNewsModal}
        onRequestClose={closeNewsModal}
        className="modal"
        overlayClassName="overlay"
        title={<Trans i18nKey="dynamic:modal-title" values={{ version }} />}
      >
        <ReactMarkdown source={props?.changelog[props.lang]} />
      </Modal>
    </DynamicNamespaces>
  )
}

export async function getStaticProps() {
  const langs = ['en', 'es']
  const props: Changelog = { changelog: {}, lang: defaultLanguage }

  langs.forEach(async (lang: string) => {
    try {
      const content = await import(`~/changelog/${version}-${lang}.md`)
      const data = matter(content.default)
      props.changelog[lang] = data?.content || ''
    } catch (e) {}
  })

  return { props }
}
