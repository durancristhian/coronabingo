class Telegram {
  sendTelegramMessage(message: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const botId = process.env.NEXT_PUBLIC_TELEGRAM_BOTID
        const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHATID

        if (!botId || !chatId) {
          reject(
            `'TELEGRAM_BOTID' and 'TELEGRAM_CHATID' env vars are not configured`,
          )

          return
        }

        const telegramMsg = encodeURIComponent(message)

        const url = `https://api.telegram.org/bot${botId}/sendMessage?chat_id=${chatId}&text=${telegramMsg}`
        const res = await fetch(url)

        resolve(res)
      } catch (error) {
        reject(error.message)
      }
    })
  }
}

const telegram = new Telegram()

export default telegram
