export const sendWhatsApp = (tel: string, message: string) => {
  window.open(`https://api.whatsapp.com/send?phone=+549${tel}&text=${message}`)
}
