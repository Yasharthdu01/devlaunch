'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import API_URL from '@/lib/config'
const steps = [
  { number: 1, title: 'Project basics',     desc: 'Tell us about your business and idea' },
  { number: 2, title: 'Platform type',      desc: 'What kind of app do you need?' },
  { number: 3, title: 'Frontend',           desc: 'UI and design preferences' },
  { number: 4, title: 'Backend & database', desc: 'Server and data requirements' },
  { number: 5, title: 'Marketing & SEO',    desc: 'Growth and visibility strategy' },
  { number: 6, title: 'Deploy & timeline',  desc: 'Hosting and go-live plan' },
]

export default function WizardPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [projectId,   setProjectId]   = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [aiLoading,   setAiLoading]   = useState(false)
  const [suggestion,  setSuggestion]  = useState('')
  const [error,       setError]       = useState('')

  const [form, setForm] = useState({
    // Step 1
    title:        '',
    description:  '',
    company:      '',
    industry:     '',
    budget:       '',
    // Step 2
    platforms:    [],
    // Step 3
    framework:    'Next.js 14',
    design_style: 'Modern & minimal',
    screens:      '',
    responsive:   'Yes',
    // Step 4
    backend:      'Node.js + Express',
    database:     'PostgreSQL',
    integrations: '',
    // Step 5
    marketing:    [],
    // Step 6
    cloud:        'Vercel + Railway',
    timeline:     '8-10 weeks',
    support:      'Yes - 3 months',
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleCheckbox(field, value) {
    const current = form[field]
    if (current.includes(value)) {
      setForm({ ...form, [field]: current.filter(v => v !== value) })
    } else {
      setForm({ ...form, [field]: [...current, value] })
    }
  }

  async function getAISuggestion() {
    setAiLoading(true)
    setSuggestion('')
    const contextMap = {
      1: form.description || form.title,
      2: form.industry || 'web app',
      3: form.industry || 'web app',
      4: form.industry || 'web app',
      5: form.company  || form.industry,
      6: form.industry || 'web app',
    }
    try {
      const res = await fetch(API_URL + '/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: currentStep, data: contextMap[currentStep] }),
      })
      const data = await res.json()
      setSuggestion(data.suggestion)
    } catch {
      setSuggestion('Could not load AI suggestion. Check backend is running.')
    }
    setAiLoading(false)
  }

  async function handleNext() {
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      if (currentStep === 1) {
        if (!form.title || !form.description) {
          setError('Please fill in project name and description')
          setLoading(false)
          return
        }
        const res = await fetch(API_URL + '/api/wizard/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            title:       form.title,
            description: form.description,
            industry:    form.industry,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.message || 'Failed to create project')
          setLoading(false)
          return
        }
        setProjectId(data.id)
      } else if (projectId) {
        await fetch(API_URL + `/api/wizard/${projectId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            requirements: {
              platforms:    form.platforms,
              framework:    form.framework,
              backend:      form.backend,
              database:     form.database,
              integrations: form.integrations,
              marketing:    form.marketing,
              cloud:        form.cloud,
            },
            budget_min:     parseInt(form.budget) || 0,
            timeline_weeks: parseInt(form.timeline) || 10,
            platform:       form.platforms.join(', '),
          }),
        })
      }

      setSuggestion('')
      setCurrentStep(prev => prev + 1)

    } catch (err) {
      setError('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  function handleBack() {
    setSuggestion('')
    setError('')
    setCurrentStep(prev => prev - 1)
  }

  async function handleSubmit() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    router.push('/tracker')
  }

  return (
    <div className="max-w-2xl mx-auto w-full">

      {/* Step progress bar */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={s.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                ${currentStep > s.number  ? 'bg-blue-600 border-blue-600 text-white' : ''}
                ${currentStep === s.number ? 'border-blue-600 text-blue-600 bg-blue-50' : ''}
                ${currentStep < s.number  ? 'border-gray-300 text-gray-400 bg-white' : ''}
              `}>
                {currentStep > s.number ? '✓' : s.number}
              </div>
              <div className="text-xs text-gray-400 mt-1 text-center w-16 hidden sm:block">
                {s.title.split(' ')[0]}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all
                ${currentStep > s.number ? 'bg-blue-600' : 'bg-gray-200'}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step card */}
      <div className="bg-[var(--bg-primary)] dark:bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
        <div className="mb-5">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Step {currentStep} of {steps.length}
          </div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {steps[currentStep - 1].desc}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Project name *</label>
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="TravelNest booking app"
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Industry</label>
                <select name="industry" value={form.industry} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white">
                  <option value="">Select...</option>
                  <option>Travel & Hospitality</option>
                  <option>E-commerce</option>
                  <option>Healthcare</option>
                  <option>EdTech</option>
                  <option>SaaS</option>
                  <option>Marketing</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Company name</label>
                <input name="company" value={form.company} onChange={handleChange}
                  placeholder="Traveler Journey Co."
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Budget range (₹)</label>
                <select name="budget" value={form.budget} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white">
                  <option value="">Select...</option>
                  <option value="100000">₹1L – ₹3L</option>
                  <option value="300000">₹3L – ₹6L</option>
                  <option value="600000">₹6L – ₹12L</option>
                  <option value="1200000">₹12L+</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Project description *</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Describe what you want to build and your business goals..."
                rows={3}
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none" />
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
              Select all that apply
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Web application', 'iOS mobile app', 'Android mobile app',
                'Admin / CMS panel', 'REST API only', 'Marketing landing page',
                'Email marketing setup', 'SEO optimization'].map(opt => (
                <label key={opt} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.platforms.includes(opt)}
                    onChange={() => handleCheckbox('platforms', opt)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Framework</label>
                <select name="framework" value={form.framework} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white">
                  <option>Next.js 14</option>
                  <option>React.js</option>
                  <option>Vue.js</option>
                  <option>Angular</option>
                  <option>Flutter Web</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Design style</label>
                <select name="design_style" value={form.design_style} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white">
                  <option>Modern & minimal</option>
                  <option>Bold & colorful</option>
                  <option>Corporate / professional</option>
                  <option>Custom brand kit</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Number of screens</label>
                <input name="screens" value={form.screens} onChange={handleChange}
                  placeholder="e.g. 15-20 screens"
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Responsive?</label>
                <select name="responsive" value={form.responsive} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white">
                  <option>Yes — mobile-first</option>
                  <option>Desktop only</option>
                  <option>Mobile only</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Backend</label>
                <select name="backend" value={form.backend} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white">
                  <option>Node.js + Express</option>
                  <option>Python FastAPI</option>
                  <option>Django REST</option>
                  <option>Spring Boot</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Database</label>
                <select name="database" value={form.database} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white">
                  <option>PostgreSQL</option>
                  <option>MySQL</option>
                  <option>MongoDB</option>
                  <option>Firebase</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Integrations needed</label>
              <textarea name="integrations" value={form.integrations} onChange={handleChange}
                placeholder="e.g. Razorpay, Google Maps, SendGrid, Twilio, Google OAuth..."
                rows={3}
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none" />
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {currentStep === 5 && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
              Marketing services to include
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['On-page SEO setup', 'Google Analytics + Search Console',
                'Google My Business', 'Social media pages setup',
                'Email marketing (Mailchimp)', 'Blog / content marketing',
                'Google Ads campaign', 'Meta Ads (Facebook/Instagram)'].map(opt => (
                <label key={opt} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.marketing.includes(opt)}
                    onChange={() => handleCheckbox('marketing', opt)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6 */}
        {currentStep === 6 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cloud provider</label>
                <select name="cloud" value={form.cloud} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white">
                  <option>Vercel + Railway</option>
                  <option>AWS</option>
                  <option>Google Cloud</option>
                  <option>Azure</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Timeline</label>
                <select name="timeline" value={form.timeline} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white">
                  <option>6-8 weeks</option>
                  <option>8-10 weeks</option>
                  <option>10-14 weeks</option>
                  <option>Flexible</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Post-launch support</label>
                <select name="support" value={form.support} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white">
                  <option>Yes - 3 months</option>
                  <option>Yes - 6 months</option>
                  <option>No, one-time</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* AI Suggestion Box */}
        <div className="mt-5 border-t border-gray-100 pt-4">
          <button
            onClick={getAISuggestion}
            disabled={aiLoading}
            className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            {aiLoading ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <span>✦</span>
            )}
            {aiLoading ? 'Getting AI suggestion...' : 'Get AI suggestion for this step'}
          </button>

          {suggestion && (
            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="text-xs font-bold text-blue-600 mb-2">✦ AI recommendation</div>
              <div className="text-sm text-blue-800 leading-relaxed whitespace-pre-line">
                {suggestion}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <span className="text-xs text-gray-400">
            Step {currentStep} of {steps.length}
          </span>
          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Next →'}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 text-sm bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit project ✓'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}