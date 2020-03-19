import pkg from '../package.json'

export default function Header() {
  return (
    <div className="bg-white p-4 shadow">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center">
          <span className="text-3xl">👑</span>
          <h1 className="font-medium ml-2 mr-4 mt-1 text-2xl">Bingo</h1>
          <span className="mt-2 text-gray-500 text-sm">v{pkg.version}</span>
        </div>
      </div>
    </div>
  )
}
