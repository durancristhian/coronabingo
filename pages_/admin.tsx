import Error from 'next/error'
import React from 'react'
import Layout from '~/components/Layout'
import Loading from '~/components/Loading'
import Login from '~/components/Login'
import Message from '~/components/Message'
import Premium from '~/components/Premium'
import useAuth from '~/hooks/useAuth'

interface Props {
  hidden: boolean
}

export default function Admin({ hidden }: Props) {
  if (hidden) {
    return <Error statusCode={404} />
  }

  const { error, loading, notAsked, user } = useAuth()

  if (notAsked || loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <Message type="error">El evento que estás buscando no existe.</Message>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout>
        <Login />
      </Layout>
    )
  }

  return (
    <Layout>
      <Premium user={user} />
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {
      hidden: process.env.NODE_ENV === 'production',
    },
  }
}
