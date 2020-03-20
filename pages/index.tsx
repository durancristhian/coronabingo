import CreateRoom from '~/components/CreateRoom'

export default function Index() {
  return (
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white md:w-2/4 mx-auto px-4 py-8 rounded shadow">
          <CreateRoom />
        </div>
      </div>
    </div>
  )
}
