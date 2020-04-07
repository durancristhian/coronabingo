import { ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

export default function Box({ children }: IProps) {
  return <div className="bg-white p-4 rounded shadow">{children}</div>
}
