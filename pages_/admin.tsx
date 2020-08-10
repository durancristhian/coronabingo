import Error from 'next/error'
import React from 'react'
import EnsureLogin from '~/components/EnsureLogin'
import Layout from '~/components/Layout'
import Premium from '~/components/Premium'
import useAuth from '~/hooks/useAuth'

interface Props {
  hidden: boolean
}

export default function Admin({ hidden }: Props) {
  if (hidden) {
    return <Error statusCode={404} />
  }

  const { user } = useAuth()

  return (
    <Layout>
      <EnsureLogin>{user && <Premium user={user} />}</EnsureLogin>
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
