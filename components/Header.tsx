export default function Header() {
  return (
    <div className="bg-white p-4 shadow">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center">
          <h1>
            <a
              href="/"
              className="flex focus:outline-none focus:shadow-outline items-center justify-center"
            >
              <img
                src={require('~/public/crown.png')}
                alt="crown"
                className="h-8"
              />
              <span className="font-medium ml-4 mt-1 text-2xl">Bingo</span>
            </a>
          </h1>
        </div>
      </div>
    </div>
  )
}
