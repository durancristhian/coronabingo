import matter from 'gray-matter'
import DynamicNamespaces from 'next-translate/DynamicNamespaces'
import Trans from 'next-translate/Trans'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Modal from '~/components/Modal'
import { version } from '~/package.json'

interface Modal {
  content: string | null
  visible: boolean
}

interface Props {
  lang: string
}

export default function NewsModal({ lang }: Props) {
  const [modal, setModal] = useState<Modal>({
    visible: false,
    content: null,
  })

  useEffect(() => {
    const asyncCheck = async () => {
      const currentVersion = localStorage.getItem('coronabingo-version')

      /*
        If there is no coronabingo-version in local storage means that is the first time
        the user gets into the app.

        We show nothing and we save the value for future cases
      */
      if (!currentVersion) {
        localStorage.setItem('coronabingo-version', version)

        return
      }

      /* If the version is the same we return, nothing to do */
      if (version === currentVersion) return

      await fetch(`changelog/${version}/${lang}.md`)
        .then(m => m.text())
        .then(matter)
        .then(md => {
          setModal({
            visible: true,
            content: md.content,
          })
        })
        /*
          The fetch failed or there is no changelog for this version
          We do nothing
        */
        .catch()
    }

    asyncCheck()
  }, [])

  const closeNewsModal = () => {
    localStorage.setItem('coronabingo-version', version)

    setModal({
      visible: false,
      content: null,
    })
  }

  if (!modal.visible || !modal.content) {
    return null
  }

  return (
    <DynamicNamespaces
      dynamic={() =>
        import(`../locales/${lang}/common.json`).then(m => m.default)
      }
      namespaces={['dynamic']}
    >
      <Modal
        isOpen={modal.visible}
        onRequestClose={closeNewsModal}
        className="modal"
        overlayClassName="overlay"
        title={
          <Trans
            i18nKey="dynamic:new-features-modal-title"
            values={{ version }}
          />
        }
      >
        <div className="markdown-body">
          <ReactMarkdown source={modal.content} />
        </div>
      </Modal>
    </DynamicNamespaces>
  )
}
