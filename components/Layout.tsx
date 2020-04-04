import { ReactNode } from 'react'
import Banner from './Banner'
import Footer from './Footer'
import Header from './Header'

interface IProps {
  children: ReactNode
}

export default function Layout({ children }: IProps) {
  return (
    <main className="bg-gray-200 flex flex-col font-inter leading-none min-h-screen text-gray-900">
      <Header />
      <div className="flex-auto">{children}</div>
      <Banner>
        <span>Dejanos tu feedback completando&nbsp;</span>
        <a
          href="https://forms.gle/egSBrsKSFnEgabff7"
          target="_blank"
          rel="noopener noreferrer"
          className="focus:outline-none focus:shadow-outline font-medium text-blue-600 underline"
        >
          esta encuesta
        </a>
        <span>&nbsp;🤩</span>
      </Banner>
      <Footer />
    </main>
  )
}
