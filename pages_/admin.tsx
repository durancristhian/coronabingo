import Error from 'next/error'
import React from 'react'
import Container from '~/components/Container'
import Layout from '~/components/Layout'
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

  return (
    <Layout>
      <Container>{!user && <Login />}</Container>
      <Container size="medium">{user && <Premium user={user} />}</Container>
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
