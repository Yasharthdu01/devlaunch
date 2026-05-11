'use client'
import API_URL from '@/lib/config'
import { useState } from 'react'

interface InstagramPost {
  day:      string
  caption:  string
  hashtags: string
}

interface GoogleAds {
  headline1:   string
  headline2:   string
  description: string
  cta:         string
}

interface MarketingData {
  seo_keywords:     string[]
  instagram_posts:  InstagramPost[]
  google_ads:       GoogleAds
  email_subject:    string
  email_preview:    string
}

export default function MarketingPage() {
  const [form, setForm] = useState({
    business_type: '',
    location:      '',
    industry:      '',
  })
  const [data,    setData]    = useState<MarketingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') : ''

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function generate() {
    if (!form.business_type || !form.industry) {
      setError('Please fill in business name and industry')
      return
    }
    setError('')
    setLoading(true)
    setData(null)

    try {
      const res = await fetch(API_URL + '/api/marketing/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const result = await res.json()
      setData(result)
    } catch {
      setError('Server error. Make sure backend is running.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* Input card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h1 className="text-lg font-bold text-gray-900 mb-1">Marketing AI</h1>
        <p className="text-sm text-gray-400 mb-5">
          Generate SEO keywords, social posts and ad copy for your business
        </p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Business name
            </label>
            <input
              name="business_type"
              value={form.business_type}
              onChange={handleChange}
              placeholder="TravelNest Agency"
              className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Varanasi, UP"
              className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Industry
            </label>
            <select
              name="industry"
              value={form.industry}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white"
            >
              <option value="">Select...</option>
              <option>Travel & Hospitality</option>
              <option>E-commerce</option>
              <option>Healthcare</option>
              <option>EdTech</option>
              <option>SaaS</option>
              <option>Food & Restaurant</option>
              <option>Real Estate</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2 mb-3">
            {error}
          </div>
        )}

        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? '✦ Generating with AI...' : '✦ Generate marketing content'}
        </button>
      </div>

      {/* Results */}
      {data && (
        <div className="flex flex-col gap-5">

          {/* SEO Keywords */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                SEO keywords
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                High intent
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.seo_keywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-sm px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-100"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Instagram posts */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Instagram content plan (7-day)
            </div>
            <div className="flex flex-col gap-3">
              {data.instagram_posts.map((post, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                      {post.day}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed mb-2">
                    {post.caption}
                  </p>
                  <p className="text-xs text-blue-500">{post.hashtags}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Google Ads */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Google Ads copy
              </div>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                High CTR format
              </span>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="text-xs text-green-700 mb-1 font-semibold">
                {form.business_type || 'Your Business'} · Ad
              </div>
              <div className="text-blue-700 font-bold text-sm mb-1">
                {data.google_ads.headline1} — {data.google_ads.headline2}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {data.google_ads.description}
              </div>
              <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">
                {data.google_ads.cta}
              </span>
            </div>
          </div>

          {/* Email marketing */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Email marketing
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-400 mb-1">Subject line</div>
              <div className="text-sm font-semibold text-gray-800 mb-3">
                {data.email_subject}
              </div>
              <div className="text-xs text-gray-400 mb-1">Preview text</div>
              <div className="text-sm text-gray-600">{data.email_preview}</div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}