import matter from 'gray-matter'
import DynamicNamespaces from 'next-translate/DynamicNamespaces'
import Trans from 'next-translate/Trans'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Modal from '~/components/Modal'
import { ModalContent } from '~/interfaces'
import { version } from '~/package.json'

interface Props {
  lang: string
}

export default function NewsModal({ lang }: Props) {
  const defaultModalValue = {
    visible: false,
    content: null,
  }
  const [modal, setModal] = useState<ModalContent>(defaultModalValue)

  const updateVersion = () => {
    localStorage.setItem('coronabingo-version', version)
  }

  useEffect(() => {
    const asyncCheck = async () => {
      const currentVersion = localStorage.getItem('coronabingo-version')

      /*
        If there is no coronabingo-version in local storage means that is the first time
        the user gets into the app.

        We show nothing and we save the value for future cases
      */
      if (!currentVersion) {
        updateVersion()

        return
      }

      /* If the version is the same we return, nothing to do */
      if (version === currentVersion) return

      try {
        const res = await fetch(`changelog/${version}/${lang}.md`)

        /* If there is no changelog for this version we do nothing */
        if (res.status === 404) {
          return
        }

        const data = await res.text()
        const { content } = matter(data)

        setModal({
          visible: true,
          content,
        })
      } catch (error) {
        /* The fetch failed. We do nothing */
      } finally {
        updateVersion()
      }
    }

    asyncCheck()
  }, [])

  const closeNewsModal = () => {
    updateVersion()

    setModal(defaultModalValue)
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
