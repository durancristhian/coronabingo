import { ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

export default function Ball({ children }: IProps) {
  return (
    <span className="stage">
      <figure className="ball">
        <span className="number" data-number={children} />
      </figure>
    </span>
  )
}
