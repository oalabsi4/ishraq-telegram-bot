/**
 * Formats an array of strings into a Telegram keyboard buttons format.
 *
 * @param  data - The array of strings to be formatted.
 * @return  - A promise that resolves to an array of formatted keyboard objects.
 */
export function formatTelegramKeyboard(data:string[]) {
    const keyboardsFormat = data.map((item) => {
      return [{
        text: item,
        callback_data: item
      }]
    })

    return keyboardsFormat
}