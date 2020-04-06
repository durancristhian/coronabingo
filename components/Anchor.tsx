import { ReactNode } from 'react'

interface IProps {
  children: ReactNode
  href?: string
}

export default function Anchor({ children, href }: IProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus:outline-none focus:shadow-outline font-medium text-blue-600 underline"
    >
      {children}
    </a>
  )
}
