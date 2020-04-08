declare module 'react-modal' {
  export default (props: {
    children: T
    className?: string
    contentLabel: string
    isOpen: boolean
    onRequestClose?: () => void
    style?: {}
  }) => T
}
