import { FaGithub, FaTwitter } from 'react-icons/fa'
// @ts-ignore
import useTranslation from 'next-translate/useTranslation'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <div className="bg-white p-4 shadow">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <p>{t('common:owner', { ownerName: 'Cristhian Duran' })}</p>
          </div>
          <div className="flex items-center">
            <a
              href="https://github.com/durancristhian/coronabingo/"
              target="_blank"
              rel="noopener noreferrer"
              className="focus:outline-none focus:shadow-outline mr-4 text-2xl"
            >
              <FaGithub />
            </a>
            <a
              href="https://twitter.com/DuranCristhian"
              target="_blank"
              rel="noopener noreferrer"
              className="focus:outline-none focus:shadow-outline text-2xl"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
