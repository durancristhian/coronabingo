import { GetServerSideProps } from 'next'
import ErrorPage from 'next/error'
import React from 'react'
import {
  missingMarkdown,
  negotiatedHeaders,
  negotiateContent,
} from '~/utils/negotiateContent'

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  locale,
}) => {
  for (const [name, value] of Object.entries(negotiatedHeaders))
    res.setHeader(name, value)
  const type = negotiateContent(req.headers.accept)
  if (type === 'text/html') return { notFound: true }
  res.statusCode = type ? 404 : 406
  res.setHeader('Content-Type', `${type || 'text/plain'}; charset=utf-8`)
  res.setHeader('X-Robots-Tag', 'noindex')
  res.end(
    req.method === 'HEAD'
      ? undefined
      : type
      ? missingMarkdown(locale || 'es')
      : 'Available representations: text/html, text/markdown.\n',
  )
  return { props: {} }
}

export default function NotFound() {
  return <ErrorPage statusCode={404} />
}
