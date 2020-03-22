import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { Fragment, useState } from 'react'
import useSWR from 'swr'
import useDeepCompareEffect from 'use-deep-compare-effect'
import Boards from '~/components/Boards'
import Message from '~/components/Message'
import SelectedNumbers from '~/components/SelectedNumbers'
import { BOARD_NUMBERS } from '~/utils/constants'
import fetcher from '~/utils/fetcher'
import db from '~/utils/firebase'

interface IPageProps {
  query: ParsedUrlQuery
}

export default function Jugar({ query }: IPageProps) {
  const router = useRouter()
  const name = router.query.name?.toString()
  const url = `/api/boards?cartones=${query.cartones?.toString()}`
  const { data, error } = useSWR<firebase.firestore.DocumentData>(url, fetcher)
  const [room, setRoom] = useState({})

  useDeepCompareEffect(() => {
    if (!name) return

    /* TODO: Memory leak here */
    db.collection('rooms')
      .doc(name)
      .onSnapshot(doc => {
        if (doc && doc.exists) {
          setRoom(doc.data() || {})
        }
      })
  }, [name, room])

  return (
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-medium text-center text-xl">Sala {name}</h2>
        {error && (
          <div className="md:w-2/4 mx-auto px-4">
            <Message type="error">
              Ocurrió un error al cargar la información de la sala. Intenta de
              nuevo recargando la página.
            </Message>
          </div>
        )}
        {!data && (
          <div className="md:w-2/4 mx-auto px-4">
            <Message type="information">
              Cargando información de la sala...
            </Message>
          </div>
        )}
        {data && (
          <Fragment>
            <Boards boards={data.boards} />
            <SelectedNumbers
              numbers={BOARD_NUMBERS}
              selectedNumbers={data.selectedNumbers || []}
            />
          </Fragment>
        )}
      </div>
    </div>
  )
}

Jugar.getInitialProps = async ({ query }: NextPageContext) => ({ query })
