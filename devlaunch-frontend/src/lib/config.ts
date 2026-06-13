const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
export default API_URL

// WhatsApp business number (digits only, with country code). Change in one place.
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917905661636'

// Display form, e.g. "+91 79056 61636"
export const WHATSAPP_DISPLAY = '+91 79056 61636'

// Build a wa.me deep link with an optional prefilled message
export const waLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`
