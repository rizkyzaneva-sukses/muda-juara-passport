import QRCode from 'qrcode'

export async function generateTicketQR(ticketCode: string, eventTitle: string) {
  const data = JSON.stringify({
    code: ticketCode,
    event: eventTitle,
    app: 'MUDA JUARA',
    ts: Date.now()
  })
  return QRCode.toDataURL(data, { width: 300, margin: 2 })
}
