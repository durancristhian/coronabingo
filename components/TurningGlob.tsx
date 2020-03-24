import classnames from 'classnames'
import { FiChevronRight } from 'react-icons/fi'
import Button from './Button'

export default function TurningGlob() {
  const onNextButtonClick = () => {}

  return (
    <div className="bg-white mt-8 px-4 py-8 rounded shadow">
      <h2 className="font-medium mb-8 text-center text-xl">Bolillero</h2>
      <div className="flex items-center">
        <div className="w-1/3">
          <div className="border-2 border-gray-600 bg-gray-200 flex items-center justify-center mb-4 px-2 py-4 rounded text-shadow-white">
            <span className="font-medium text-5xl">10</span>
          </div>
          <Button
            id="next"
            className="w-full"
            /* disabled={false} */
            onButtonClick={onNextButtonClick}
          >
            <span className="mr-4">Siguiente</span>
            <FiChevronRight className="text-2xl" />
          </Button>
        </div>
        <div className="ml-8 w-2/3">
          <div className="flex items-center justify-center">
            {[67, 2, 30, 4, 50].map((n, i) => (
              <div
                key={n}
                className={classnames([
                  'border-2 border-gray-600 bg-gray-200 flex font-medium items-center justify-center mx-4 rounded-full shadow-lg',
                  i > 0 ? 'h-16 text-2xl w-16' : 'h-24 text-4xl w-24'
                ])}
              >
                <span>{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
