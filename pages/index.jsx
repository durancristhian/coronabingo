import fetch from 'isomorphic-unfetch'
import useSWR from 'swr'
import Boards from '../components/Boards'
import Message from '../components/Message'

export default function Home() {
  const url = '/api/boards'
  const { data, error } = useSWR(url, fetcher)

  if (error) {
    return (
      <Message>
        <p>Hubo un error.</p>
      </Message>
    )
  }

  if (!data) {
    return (
      <Message>
        <p>Cargando...</p>
      </Message>
    )
  }

  return <Boards boards={data.boards} />
}

const fetcher = async (...args) => {
  const res = await fetch(...args)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.error)
  }

  return data
}
