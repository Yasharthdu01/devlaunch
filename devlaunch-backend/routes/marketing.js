const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
require('dotenv').config()

// POST /api/marketing/generate
router.post('/generate', authMiddleware, async (req, res) => {
  const { business_type, location, industry } = req.body

  const prompt = `You are a marketing expert. Generate marketing content for a ${industry} business called "${business_type}" located in ${location}.

Return ONLY this JSON, no extra text:
{
  "seo_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "instagram_posts": [
    {"day": "Monday", "caption": "post caption here", "hashtags": "#tag1 #tag2 #tag3"},
    {"day": "Wednesday", "caption": "post caption here", "hashtags": "#tag1 #tag2 #tag3"},
    {"day": "Friday", "caption": "post caption here", "hashtags": "#tag1 #tag2 #tag3"},
    {"day": "Sunday", "caption": "post caption here", "hashtags": "#tag1 #tag2 #tag3"}
  ],
  "google_ads": {
    "headline1": "headline here",
    "headline2": "second headline here",
    "description": "ad description under 90 chars",
    "cta": "Book Now"
  },
  "email_subject": "email subject line here",
  "email_preview": "email preview text here"
}`

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt,
        stream: false,
        options: { temperature: 0.3 },
      }),
    })

    const aiData = await response.json()
    const text = aiData.response

    // Extract JSON
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON found')

    const parsed = JSON.parse(text.substring(start, end + 1))
    res.json(parsed)

  } catch (err) {
    console.error(err.message)
    // Fallback response
    res.json({
      seo_keywords: [
        `${business_type} ${location}`,
        `best ${industry} in ${location}`,
        `${industry} services ${location}`,
        `affordable ${industry} ${location}`,
        `top ${business_type}`,
        `${location} ${industry} online`,
      ],
      instagram_posts: [
        { day: 'Monday',    caption: `Start your week with our amazing ${industry} services!`, hashtags: `#${industry} #${location} #Business` },
        { day: 'Wednesday', caption: `Mid-week special — check out what we offer at ${business_type}!`, hashtags: `#MidWeek #${industry} #Special` },
        { day: 'Friday',    caption: `Friday deals at ${business_type} — don't miss out!`, hashtags: `#FridayDeals #${industry} #Weekend` },
        { day: 'Sunday',    caption: `Plan your week ahead with ${business_type}. Book now!`, hashtags: `#Sunday #Planning #${industry}` },
      ],
      google_ads: {
        headline1:   `Best ${industry} in ${location}`,
        headline2:   `Book Online · Fast · Reliable`,
        description: `Top-rated ${industry} services in ${location}. Easy booking, great prices.`,
        cta:         'Book Now',
      },
      email_subject:  `Special offer from ${business_type} — limited time!`,
      email_preview:  `Don't miss our exclusive deals this week at ${business_type}`,
    })
  }
})

module.exports = router