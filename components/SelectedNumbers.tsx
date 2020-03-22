import Button from './Button'

interface IProps {
  numbers: number[]
  onSelectNumber?: (n: number) => void
  selectedNumbers: number[]
}

export default function SelectedNumbers({
  numbers,
  onSelectNumber = () => {},
  selectedNumbers
}: IProps) {
  return (
    <div className="bg-white mt-8 px-4 py-8 rounded shadow">
      <div className="mb-8">
        <h2 className="font-medium text-center text-xl">Bolillero</h2>
      </div>
      <div className="flex flex-wrap">
        {numbers.map(n => (
          <div key={n} className="p-2 text-center" style={{ width: '10%' }}>
            <Button
              className="h-10 md:h-16 rounded-full w-10 md:w-16"
              onButtonClick={() => onSelectNumber(n)}
              color={selectedNumbers.includes(n) ? 'green' : 'gray'}
            >
              {n}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
