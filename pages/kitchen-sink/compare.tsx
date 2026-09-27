import Head from 'next/head'
import React from 'react'

const VERSIONS = [
  {
    description: 'La interfaz actual, sin cambios.',
    href: '/kitchen-sink',
    label: 'Original',
  },
  {
    description: 'Cálida, lineal e inspirada en time.fyi.',
    href: '/kitchen-sink/time',
    label: 'Propuesta 1',
  },
  {
    description: 'Una evolución más sobria de la UI actual.',
    href: '/kitchen-sink/refined',
    label: 'Propuesta 2',
  },
  {
    description: 'Una mesa de juego simple, luminosa y lúdica.',
    href: '/kitchen-sink/playful',
    label: 'Propuesta 3',
  },
]

export default function KitchenSinkComparison() {
  return (
    <main className="kitchen-sink-compare">
      <Head>
        <title>Comparación de propuestas | Coronabingo</title>
        <meta content="noindex,nofollow" name="robots" />
      </Head>

      <header className="ks-compare-header">
        <div>
          <p className="ks-compare-eyebrow">Estudio de interfaz</p>
          <h1>Cuatro maneras de ver Coronabingo</h1>
          <p>
            El contenido es el mismo en cada panel. Cada vista tiene su propio
            scroll para poder comparar una escena contra otra.
          </p>
        </div>
      </header>

      <div className="ks-compare-grid">
        {VERSIONS.map(({ description, href, label }) => (
          <article className="ks-compare-panel" key={href}>
            <header>
              <div>
                <h2>{label}</h2>
                <p>{description}</p>
              </div>
              <a href={href}>Abrir</a>
            </header>
            <iframe src={href} title={`${label}: ${description}`} />
          </article>
        ))}
      </div>
    </main>
  )
}
