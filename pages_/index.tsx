import useTranslation from 'next-translate/useTranslation'
import CreateRoom from '~/components/CreateRoom'
import Layout from '~/components/Layout'

export default function Index() {
  const { t } = useTranslation()

  return (
    <Layout>
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="md:w-2/4 mx-auto">
            <img
              src={require('~/public/virus/success.png')}
              alt="coronavirus feliz"
              className="h-32 mx-auto"
            />
            <div className="leading-normal">
              <p className="my-8">{t('index:intro')}</p>
            </div>
          </div>
          <div className="bg-white md:w-2/4 mx-auto px-4 py-8 rounded shadow">
            <CreateRoom />
          </div>
          <div className="md:w-2/4 mx-auto">
            <div className="leading-normal">
              <p className="my-8">
                <span>{t('index:videocall-suggestion')} </span>
                <a
                  href="https://hangouts.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 underline"
                >
                  Google Hangouts
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
