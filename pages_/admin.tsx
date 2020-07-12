import Error from 'next/error'
import React from 'react'
import Layout from '~/components/Layout'
import Loading from '~/components/Loading'
import Login from '~/components/Login'
import Premium from '~/components/Premium'
import useAuth from '~/hooks/useAuth'

interface Props {
  hidden: boolean
}

export default function Admin({ hidden }: Props) {
  const { user } = useAuth()

  if (hidden) {
    return <Error statusCode={404} />
  }

  if (user === 'not asked') {
    return (
      <Layout>
        <Loading />
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

  return <Layout>{user && <Premium user={user} />}</Layout>
}

export async function getStaticProps() {
  return {
    props: {
      hidden: process.env.NODE_ENV === 'production',
    },
  }
}
