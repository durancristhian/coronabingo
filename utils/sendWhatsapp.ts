export const sendWhatsApp = (message: string) => {
  window.open(`https://api.whatsapp.com/send?text=${message}`)
}

export const sendWhatsAppTo = (tel: string, message: string) => {
  window.open(`https://api.whatsapp.com/send?phone=+549${tel}&text=${message}`)
}
