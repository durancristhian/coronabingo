export default function Header() {
  return (
    <div className="bg-white p-4 shadow">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center">
          <img
            src={require('~/public/crown.png')}
            alt="crown"
            className="h-8"
          />
          <h1 className="font-medium ml-4 mt-1 text-2xl">Bingo</h1>
        </div>
      </div>
    </div>
  )
}
