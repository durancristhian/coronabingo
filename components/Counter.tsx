import React, { memo } from 'react'

interface Props {
  amount: number
}

export default memo(function Counter({ amount }: Props) {
  return (
    <div className="flex items-center justify-center">
      <p className="italic">Ya somos</p>
      <div className="flex items-center mx-4">
        <div className="bg-yellow-300 font-medium px-4 py-1 rounded text-2xl md:text-3xl text-yellow-800">
          {amount}
        </div>
      </div>
      <p className="italic">para jugar</p>
    </div>
  )
})
