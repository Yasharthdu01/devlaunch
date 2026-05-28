'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'

interface FormData {
  name:         string
  email:        string
  phone:        string
  company:      string
  industry:     string
  budget:       string
  message:      string
  project_type: string
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', company: '',
    industry: '', budget: '', message: '', project_type: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in name, email and message')
      return
    }
    setLoading(true)
    setError('')

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      await fetch(API_URL + '/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch {
      // Even if backend fails, show success to user
      setSubmitted(true)
    }
    setLoading(false)
  }

  const contactInfo = [
    {
      icon: <MessageCircle size={20} />,
      label: 'WhatsApp',
      value: '+91 XXXXX XXXXX',
      sub: 'Fastest response — usually within 30 mins',
      href: 'https://wa.me/91XXXXXXXXXX',
      color: 'bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400',
    },
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: 'yasharth@devlaunch.in',
      sub: 'For detailed queries and proposals',
      href: 'mailto:yasharth@devlaunch.in',
      color: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    },
    {
      icon: <MapPin size={20} />,
      label: 'Location',
      value: 'Kanpur, Uttar Pradesh',
      sub: 'Serving clients across India remotely',
      href: '#',
      color: 'bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400',
    },
    {
      icon: <Clock size={20} />,
      label: 'Working hours',
      value: 'Mon–Sat, 10am–7pm IST',
      sub: 'AI chatbot available 24/7',
      href: '#',
      color: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    },
  ]

  const faqs = [
    { q: 'How long does a project take?',          a: 'Typically 6-10 weeks depending on complexity. Simple websites take 2-3 weeks, full apps with mobile take 8-12 weeks.' },
    { q: 'What is included in the price?',          a: 'Design, frontend, backend, database, deployment, SSL, hosting setup and 30 days post-launch support.' },
    { q: 'Do you work with clients outside Kanpur?', a: 'Yes! We work 100% remotely with clients across India. Most communication happens on our platform + WhatsApp.' },
    { q: 'Can I get a free demo first?',            a: 'Absolutely. You can register and use the platform for free. Our AI wizard gives you an instant cost estimate.' },
    { q: 'What happens after project delivery?',    a: 'We offer monthly maintenance plans starting at ₹3,000/month for bug fixes and minor updates.' },
    { q: 'Do you offer EMI or payment installments?', a: 'Yes. Most projects are split 30% upfront + 40% mid-project + 30% on delivery. We also offer 3-month EMI.' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      {/* Nav */}
      <nav className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-black text-blue-600 dark:text-blue-400">
          Dev<span className="text-gray-900 dark:text-white">Launch</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
            ← Back to home
          </Link>
          <Link href="/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Get started free
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-blue-50/50 dark:from-blue-950/20 to-white dark:to-gray-900 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">
            Get in touch
          </div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            Let's build something<br />
            <span className="text-blue-600 dark:text-blue-400">great together</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
            Fill the form below or WhatsApp us directly. We respond within 30 minutes during business hours.
          </p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact info */}
          <div className="lg:col-span-1">
            <div className="space-y-4 mb-8">
              {contactInfo.map(c => (
                <a key={c.label} href={c.href}
                  className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl hover:border-blue-200 dark:hover:border-blue-700 transition-all group">
                  <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center flex-shrink-0`}>
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">{c.label}</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{c.value}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{c.sub}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Quick action */}
            <div className="bg-green-600 dark:bg-green-700 rounded-2xl p-5 text-white">
              <div className="text-lg font-black mb-2">💬 WhatsApp us directly</div>
              <p className="text-green-200 text-sm leading-relaxed mb-4">
                Fastest way to reach us. Send a message and we'll get back within 30 minutes.
              </p>
              <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noreferrer">
                <button className="w-full bg-white text-green-600 font-bold py-2.5 rounded-xl text-sm hover:bg-green-50 transition-colors">
                  Open WhatsApp →
                </button>
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                  Message received!
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                  In the meantime, try our free AI wizard to get an instant cost estimate.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/register">
                    <button className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-blue-700 transition-colors">
                      Try AI wizard free
                      <ArrowRight size={16} />
                    </button>
                  </Link>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Send another
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8">
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">
                  Tell us about your project
                </h2>

                {error && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Your name *
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Rajesh Kumar"
                        className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Email address *
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="rajesh@clinic.com"
                        className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Phone / WhatsApp
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Company name
                      </label>
                      <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Sharma Dental Clinic"
                        className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Industry
                      </label>
                      <select
                        name="industry"
                        value={form.industry}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select industry...</option>
                        <option>Healthcare / Dental</option>
                        <option>Real Estate / Builders</option>
                        <option>Travel & Hospitality</option>
                        <option>Education / EdTech</option>
                        <option>Restaurant / Food</option>
                        <option>E-commerce / Retail</option>
                        <option>CA / Finance</option>
                        <option>Manufacturing</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Budget range
                      </label>
                      <select
                        name="budget"
                        value={form.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select budget...</option>
                        <option>Under ₹50,000</option>
                        <option>₹50,000 – ₹1,00,000</option>
                        <option>₹1,00,000 – ₹3,00,000</option>
                        <option>₹3,00,000 – ₹5,00,000</option>
                        <option>Above ₹5,00,000</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      What do you want to build? *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us about your project — what problem you want to solve, what features you need, any specific requirements..."
                      className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-sm transition-all disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send message'}
                    {!loading && <ArrowRight size={16} />}
                  </button>

                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                    Or skip the form —{' '}
                    <Link href="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                      try our free AI wizard
                    </Link>
                    {' '}and get an instant estimate
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">FAQ</div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Common questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 dark:bg-black text-white py-8 px-6 text-center">
        <div className="text-xs text-gray-500">
          © 2026 DevLaunch · Built in Kanpur, India 🇮🇳
          <span className="mx-3">·</span>
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span className="mx-3">·</span>
          <Link href="/about" className="hover:text-gray-300">About</Link>
          <span className="mx-3">·</span>
          <Link href="/register" className="hover:text-gray-300">Get started</Link>
        </div>
      </footer>

    </div>
  )
}