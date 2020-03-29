import { SyntheticEvent, ReactNode } from 'react'
import { FiX } from 'react-icons/fi'

interface DrawerProps {
  children: ReactNode
  onClose: (e: SyntheticEvent) => void
  open: boolean
}

const Drawer = ({ children, onClose, open }: DrawerProps) => (
  <nav
    className={`${
      open ? 'navbar-open' : 'navbar-close'
    } navbar fixed overflow-x-scroll bg-white top-0 h-screen px-4 shadow-md z-50`}
  >
    <button
      onClick={onClose}
      className="p-2 text-2xl font-bold absolute right-0"
    >
      <FiX />
    </button>
    {children}
  </nav>
)

export default Drawer
