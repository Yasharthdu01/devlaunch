const express = require('express')
const router = express.Router()
const pool = require('../db')
const { sendMail, ADMIN_EMAIL } = require('../utils/mailer')

// ── WhatsApp AI agent — standalone product ────────────────────────────
// This route powers the interactive "try it" demo on the product page and
// captures leads for the ₹999-2,999/mo plans. The conversation engine here
// is a deterministic, provider-agnostic mock: it mimics how an AI receptionist
// would qualify and book a customer over WhatsApp. When you connect a real BSP
// (Meta Cloud API / Gupshup / Twilio) you replace `respond()` with an LLM call
// and forward the same { reply, quickReplies, booking } shape — the front end
// and webhook contract stay identical.

async function ensureWaTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS whatsapp_leads (
      id SERIAL PRIMARY KEY,
      business VARCHAR(120),
      name VARCHAR(100),
      phone VARCHAR(20),
      industry VARCHAR(60),
      plan VARCHAR(40),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
}
ensureWaTables()

// Industry-specific receptionist personas — the sellable templates.
const TEMPLATES = {
  dental: {
    name: 'Dr. Sharma Dental Clinic',
    greeting: "Hi! 👋 Welcome to Dr. Sharma Dental Clinic. I can book appointments, share treatment prices, or answer your questions. How can I help?",
    quickReplies: ['Book an appointment', 'Teeth cleaning price', 'Are you open today?'],
    keywords: {
      book: "I'd be happy to book you in. We have slots tomorrow at 11:00 AM, 1:30 PM and 5:00 PM. Which works best?",
      price: "Teeth cleaning (scaling & polishing) is ₹800. Root canal starts at ₹3,500. Want me to book a check-up first?",
      open: "Yes! We're open today till 8 PM. Walk-ins welcome, but booking a slot means zero waiting. Shall I reserve one for you?",
      pain: "Sorry to hear that — tooth pain shouldn't wait. I can get you the earliest slot today at 5:00 PM with Dr. Sharma. Should I confirm it?",
    },
  },
  realestate: {
    name: 'Skyline Properties',
    greeting: "Hello! 🏠 Skyline Properties here. Looking to buy, rent, or sell? Tell me your budget and area and I'll shortlist options for you.",
    quickReplies: ['2BHK under ₹50L', 'Rental flats', 'Schedule a site visit'],
    keywords: {
      buy: "Great! In that budget we have three 2BHKs in Gomti Nagar — ₹42L, ₹47L and ₹49L, all ready-to-move. Want photos on WhatsApp and a site visit this weekend?",
      rent: "We have rental flats from ₹12,000/month in your area. Are you looking for furnished or unfurnished? And for how many people?",
      visit: "Perfect. I can arrange a site visit Saturday at 11 AM or Sunday at 4 PM. Which suits you? I'll share the exact location pin once confirmed.",
      budget: "Noted. I'll filter to that budget and send you 3 best matches with photos. Can I take your name to share the details?",
    },
  },
  restaurant: {
    name: 'Spice Garden',
    greeting: "Namaste! 🍽️ Welcome to Spice Garden. I can take your order, book a table, or share today's specials. What would you like?",
    quickReplies: ['Order food', 'Book a table', "Today's specials"],
    keywords: {
      order: "Lovely! Today's bestsellers are Paneer Tikka (₹240), Dal Makhani (₹220) and Butter Naan (₹45). What would you like to add to your order?",
      table: "Sure! For how many people and what time? We have tables free tonight from 7:30 PM onwards.",
      special: "Today's specials: Hyderabadi Dum Biryani (₹280) and Gulab Jamun with Rabri (₹120). Want me to add them to an order or book a table?",
      deliver: "Yes, we deliver in 30-40 mins within 5 km. Share your area and I'll confirm if you're in range — then we can take the order right here.",
    },
  },
}

// Very small intent matcher — good enough to feel real in a demo.
function respond(template, message) {
  const t = TEMPLATES[template] || TEMPLATES.dental
  const m = (message || '').toLowerCase()
  const k = t.keywords

  const match = (...words) => words.some(w => m.includes(w))

  let reply
  let booking = false

  if (template === 'dental') {
    if (match('pain', 'hurt', 'ache')) reply = k.pain
    else if (match('book', 'appointment', 'slot', 'visit')) reply = k.book
    else if (match('price', 'cost', 'cleaning', 'charge', 'fee')) reply = k.price
    else if (match('open', 'today', 'timing', 'hours')) reply = k.open
  } else if (template === 'realestate') {
    if (match('rent', 'rental', 'lease')) reply = k.rent
    else if (match('visit', 'see', 'tour')) reply = k.visit
    else if (match('buy', '2bhk', 'flat', 'house', 'under', 'lakh', '50l')) reply = k.buy
    else if (match('budget', 'price', 'cost')) reply = k.budget
  } else if (template === 'restaurant') {
    if (match('table', 'reserve', 'book', 'seat')) reply = k.table
    else if (match('deliver', 'delivery', 'home')) reply = k.deliver
    else if (match('order', 'food', 'menu', 'paneer', 'biryani')) reply = k.order
    else if (match('special', 'today', 'recommend')) reply = k.special
  }

  // Confirmations close the loop and "book". Use word boundaries so that, e.g.,
  // "book" doesn't accidentally match "ok".
  const isConfirmation = /\b(yes|confirm|confirmed|ok|okay|sure|please do|go ahead|book it|reserve it|that works|11 ?am|1:30|5 ?pm|saturday|sunday|tomorrow)\b/.test(m)
  if (isConfirmation) {
    reply = reply ||
      "Done! ✅ I've noted that down. You'll get a confirmation message shortly. Is there anything else I can help with?"
    if (/\b(yes|confirm|confirmed|ok|okay|sure|please do|go ahead|book it|reserve it|that works)\b/.test(m)) {
      booking = true
    }
  }

  if (!reply) {
    reply = `Thanks for your message! A team member at ${t.name} will follow up shortly. Meanwhile, I can help with: ${t.quickReplies.join(', ')}.`
  }

  return { reply, quickReplies: t.quickReplies, booking }
}

// GET /api/whatsapp/templates — list sellable personas for the product page.
router.get('/templates', (req, res) => {
  res.json(
    Object.entries(TEMPLATES).map(([id, t]) => ({
      id,
      name: t.name,
      greeting: t.greeting,
      quickReplies: t.quickReplies,
    }))
  )
})

// POST /api/whatsapp/demo — drive the interactive demo conversation.
router.post('/demo', (req, res) => {
  const { template, message } = req.body
  if (!message) {
    const t = TEMPLATES[template] || TEMPLATES.dental
    return res.json({ reply: t.greeting, quickReplies: t.quickReplies, booking: false })
  }
  res.json(respond(template, message))
})

// POST /api/whatsapp/lead — capture interest in a paid plan.
router.post('/lead', async (req, res) => {
  const { business, name, phone, industry, plan } = req.body
  if (!phone && !name) {
    return res.status(400).json({ message: 'Please share a name or phone number.' })
  }
  try {
    await pool.query(
      `INSERT INTO whatsapp_leads (business, name, phone, industry, plan)
       VALUES ($1, $2, $3, $4, $5)`,
      [business || null, name || null, phone || null, industry || null, plan || null]
    )

    sendMail({
      to: ADMIN_EMAIL,
      subject: `New WhatsApp AI agent lead — ${business || name || phone}`,
      text:
        `Someone wants a WhatsApp AI agent.\n\n` +
        `Business: ${business || '—'}\nName: ${name || '—'}\nPhone: ${phone || '—'}\n` +
        `Industry: ${industry || '—'}\nPlan: ${plan || '—'}\n`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#111;max-width:640px">
          <h2 style="color:#16a34a">New WhatsApp AI agent lead</h2>
          <ul style="font-size:14px;line-height:1.8">
            <li><b>Business:</b> ${business || '—'}</li>
            <li><b>Name:</b> ${name || '—'}</li>
            <li><b>Phone:</b> ${phone || '—'}</li>
            <li><b>Industry:</b> ${industry || '—'}</li>
            <li><b>Plan:</b> ${plan || '—'}</li>
          </ul>
        </div>`,
    }).catch(() => {})

    res.status(201).json({ message: 'Lead captured' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM whatsapp_leads ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
