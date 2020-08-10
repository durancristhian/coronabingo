import React from 'react'
import EnsureLogin from '~/components/EnsureLogin'
import Layout from '~/components/Layout'
import Premium from '~/components/Premium'
import useAuth from '~/hooks/useAuth'

export default function Admin() {
  const { user } = useAuth()

  return (
    <Layout>
      <EnsureLogin>{user && <Premium user={user} />}</EnsureLogin>
    </Layout>
  )
}
