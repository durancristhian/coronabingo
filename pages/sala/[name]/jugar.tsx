import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import useDeepCompareEffect from 'use-deep-compare-effect'
import Boards from '../../../components/Boards'
import Message from '../../../components/Message'
import SelectedNumbers from '../../../components/SelectedNumbers'
import fetcher from '../../../utils/fetcher'
import db from '../../../utils/firebase'

export default function Jugar({ query }) {
  const router = useRouter()
  const { name } = router.query
  const url = `/api/boards?cartones=${query.cartones}`
  const { data, error } = useSWR(url, fetcher)
  const [room, setRoom] = useState({})

  useDeepCompareEffect(() => {
    if (!name) return

    /* TODO: Memory leak here */
    db.collection('rooms')
      .doc(name)
      .onSnapshot(doc => {
        setRoom(doc.data())
      })
  }, [name, room])

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

  return (
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-medium text-center text-xl">Sala {name}</h2>
        <Boards boards={data.boards} />
        <SelectedNumbers
          numbers={NUMBERS}
          selectedNumbers={room.selectedNumbers || []}
        />
      </div>
    </div>
  )
}

Jugar.getInitialProps = async ({ _, query }) => ({ query })

const NUMBERS = [...Array(90).keys()].map(n => n + 1)
