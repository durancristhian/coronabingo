import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { EasterEggContext } from '~/contexts/EasterEggContext'

export default function Footer() {
  const { setVisibility } = useContext(EasterEggContext)
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const playerId = router.query.jugador?.toString()
  const [times, setTimes] = useState(0)

  useEffect(() => {
    if (times !== 7) return

    setVisibility(true)
  }, [times])

  const tricks = () => {
    if (roomName && playerId && times < 7) {
      setTimes(t => t + 1)
    }
  }

  return (
    <div className="bg-white p-4 shadow">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <p>
              Hecho por <span onClick={tricks}>Cristhian Duran</span>
            </p>
          </div>
          <div className="flex items-center">
            <a
              href="https://github.com/durancristhian/coronabingo/"
              target="_blank"
              rel="noopener noreferrer"
              className="focus:outline-none focus:shadow-outline mr-4 text-2xl"
            >
              <FaGithub />
            </a>
            <a
              href="https://twitter.com/DuranCristhian"
              target="_blank"
              rel="noopener noreferrer"
              className="focus:outline-none focus:shadow-outline text-2xl"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
