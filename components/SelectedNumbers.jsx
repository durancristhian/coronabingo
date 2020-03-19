import Button from './Button'

export default function SelectedNumbers({
  numbers,
  onSelectNumber = () => {},
  selectedNumbers
}) {
  return (
    <div className="bg-white mt-8 px-4 py-8 rounded shadow">
      <div className="mb-8">
        <h2 className="font-medium text-center text-xl">Bolillero</h2>
      </div>
      <div className="flex flex-wrap">
        {numbers.map(n => (
          <div key={n} className="p-1" style={{ width: '10%' }}>
            <Button
              className="w-full"
              onClick={() => onSelectNumber(n)}
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
