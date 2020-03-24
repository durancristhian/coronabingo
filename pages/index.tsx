import CreateRoom from '~/components/CreateRoom'

export default function Index() {
  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="md:w-2/4 mx-auto">
          <img
            src={require('~/public/virus/success.png')}
            alt="coronavirus feliz"
            className="h-32 mx-auto"
          />
          <h2 className="font-medium mt-4 text-center text-2xl uppercase">
            ¡Hola!
          </h2>
          <div className="leading-normal">
            <p className="my-8">
              En esta página vas a poder jugar al bingo con otras personas.
            </p>
          </div>
        </div>
        <div className="bg-white md:w-2/4 mx-auto px-4 py-8 rounded shadow">
          <CreateRoom />
        </div>
        <div className="md:w-2/4 mx-auto">
          <div className="leading-normal">
            <p className="my-8">
              Vas a necesitar crear una videollamada con quienes quieras jugar.
              Te recomiendo&nbsp;
              <a
                href="https://hangouts.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 underline"
              >
                Google Hangouts
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
