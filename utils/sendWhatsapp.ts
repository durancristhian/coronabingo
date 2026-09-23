export const sendWhatsApp = (message: string) => {
  window.open(`https://api.whatsapp.com/send?text=${message}`)
}
