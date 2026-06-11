'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import API_URL from '@/lib/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'

const steps = [
  { number: 1, title: 'Project basics',     desc: 'Tell us about your business and idea' },
  { number: 2, title: 'Platform type',      desc: 'What kind of app do you need?' },
  { number: 3, title: 'Frontend',           desc: 'UI and design preferences' },
  { number: 4, title: 'Backend & database', desc: 'Server and data requirements' },
  { number: 5, title: 'Marketing & SEO',    desc: 'Growth and visibility strategy' },
  { number: 6, title: 'Deploy & timeline',  desc: 'Hosting and go-live plan' },
]

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    '& fieldset': { borderColor: 'var(--border)' },
    '&:hover fieldset': { borderColor: 'var(--blue)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--blue)' },
  },
  '& .MuiInputLabel-root': { color: 'var(--text-muted)', fontSize: '0.875rem' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--blue)' },
} as const

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

  const labelSx = { fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' } as const

  return (
    <Box sx={{ maxWidth: 672, mx: 'auto', width: '100%' }}>

      {/* Step progress bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        {steps.map((s, i) => {
          const done    = currentStep > s.number
          const active  = currentStep === s.number
          return (
            <Box key={s.number} sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '2px solid',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                    ...(done
                      ? { bgcolor: 'var(--blue)', borderColor: 'var(--blue)', color: '#fff' }
                      : active
                      ? { borderColor: 'var(--blue)', color: 'var(--blue)', bgcolor: 'var(--blue-light)' }
                      : { borderColor: 'var(--border)', color: 'var(--text-muted)', bgcolor: 'var(--bg-primary)' }),
                  }}
                >
                  {done ? '✓' : s.number}
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    mt: 0.5,
                    textAlign: 'center',
                    width: 64,
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  {s.title.split(' ')[0]}
                </Typography>
              </Box>
              {i < steps.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: '2px',
                    mx: 0.5,
                    mb: 2,
                    transition: 'all 0.2s',
                    bgcolor: currentStep > s.number ? 'var(--blue)' : 'var(--border)',
                  }}
                />
              )}
            </Box>
          )
        })}
      </Box>

      {/* Step card */}
      <Paper
        elevation={0}
        sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 3 }}
      >
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={labelSx}>
            Step {currentStep} of {steps.length}
          </Typography>
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', mt: 0.5 }}>
            {steps[currentStep - 1].title}
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mt: 0.25 }}>
            {steps[currentStep - 1].desc}
          </Typography>
        </Box>

        {/* Error */}
        {error && (
          <Box
            sx={{
              bgcolor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '0.875rem',
              borderRadius: '8px',
              px: 2,
              py: 1,
              mb: 2,
            }}
          >
            {error}
          </Box>
        )}

        {/* STEP 1 */}
        {currentStep === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
              <TextField
                label="Project name *"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="TravelNest booking app"
                size="small"
                fullWidth
                sx={fieldSx}
              />
              <TextField
                select
                label="Industry"
                name="industry"
                value={form.industry}
                onChange={handleChange}
                size="small"
                fullWidth
                sx={fieldSx}
              >
                <MenuItem value="">Select...</MenuItem>
                <MenuItem value="Travel & Hospitality">Travel & Hospitality</MenuItem>
                <MenuItem value="E-commerce">E-commerce</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
                <MenuItem value="EdTech">EdTech</MenuItem>
                <MenuItem value="SaaS">SaaS</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
              <TextField
                label="Company name"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Traveler Journey Co."
                size="small"
                fullWidth
                sx={fieldSx}
              />
              <TextField
                select
                label="Budget range (₹)"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                size="small"
                fullWidth
                sx={fieldSx}
              >
                <MenuItem value="">Select...</MenuItem>
                <MenuItem value="100000">₹1L – ₹3L</MenuItem>
                <MenuItem value="300000">₹3L – ₹6L</MenuItem>
                <MenuItem value="600000">₹6L – ₹12L</MenuItem>
                <MenuItem value="1200000">₹12L+</MenuItem>
              </TextField>
            </Box>
            <TextField
              label="Project description *"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what you want to build and your business goals..."
              multiline
              rows={3}
              fullWidth
              sx={fieldSx}
            />
          </Box>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <Box>
            <Typography sx={{ ...labelSx, mb: 1.5, display: 'block' }}>
              Select all that apply
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1 }}>
              {['Web application', 'iOS mobile app', 'Android mobile app',
                'Admin / CMS panel', 'REST API only', 'Marketing landing page',
                'Email marketing setup', 'SEO optimization'].map(opt => (
                <FormControlLabel
                  key={opt}
                  sx={{
                    m: 0,
                    p: 1.5,
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    transition: 'border-color 0.15s',
                    '&:hover': { borderColor: 'var(--blue)' },
                    '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: 'var(--text-secondary)' },
                  }}
                  control={
                    <Checkbox
                      checked={form.platforms.includes(opt)}
                      onChange={() => handleCheckbox('platforms', opt)}
                      size="small"
                      sx={{ color: 'var(--border)', '&.Mui-checked': { color: 'var(--blue)' }, p: 0.5, mr: 0.5 }}
                    />
                  }
                  label={opt}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
              <TextField
                select
                label="Framework"
                name="framework"
                value={form.framework}
                onChange={handleChange}
                size="small"
                fullWidth
                sx={fieldSx}
              >
                <MenuItem value="Next.js 14">Next.js 14</MenuItem>
                <MenuItem value="React.js">React.js</MenuItem>
                <MenuItem value="Vue.js">Vue.js</MenuItem>
                <MenuItem value="Angular">Angular</MenuItem>
                <MenuItem value="Flutter Web">Flutter Web</MenuItem>
              </TextField>
              <TextField
                select
                label="Design style"
                name="design_style"
                value={form.design_style}
                onChange={handleChange}
                size="small"
                fullWidth
                sx={fieldSx}
              >
                <MenuItem value="Modern & minimal">Modern & minimal</MenuItem>
                <MenuItem value="Bold & colorful">Bold & colorful</MenuItem>
                <MenuItem value="Corporate / professional">Corporate / professional</MenuItem>
                <MenuItem value="Custom brand kit">Custom brand kit</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
              <TextField
                label="Number of screens"
                name="screens"
                value={form.screens}
                onChange={handleChange}
                placeholder="e.g. 15-20 screens"
                size="small"
                fullWidth
                sx={fieldSx}
              />
              <TextField
                select
                label="Responsive?"
                name="responsive"
                value={form.responsive}
                onChange={handleChange}
                size="small"
                fullWidth
                sx={fieldSx}
              >
                <MenuItem value="Yes">Yes — mobile-first</MenuItem>
                <MenuItem value="Desktop only">Desktop only</MenuItem>
                <MenuItem value="Mobile only">Mobile only</MenuItem>
              </TextField>
            </Box>
          </Box>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
              <TextField
                select
                label="Backend"
                name="backend"
                value={form.backend}
                onChange={handleChange}
                size="small"
                fullWidth
                sx={fieldSx}
              >
                <MenuItem value="Node.js + Express">Node.js + Express</MenuItem>
                <MenuItem value="Python FastAPI">Python FastAPI</MenuItem>
                <MenuItem value="Django REST">Django REST</MenuItem>
                <MenuItem value="Spring Boot">Spring Boot</MenuItem>
              </TextField>
              <TextField
                select
                label="Database"
                name="database"
                value={form.database}
                onChange={handleChange}
                size="small"
                fullWidth
                sx={fieldSx}
              >
                <MenuItem value="PostgreSQL">PostgreSQL</MenuItem>
                <MenuItem value="MySQL">MySQL</MenuItem>
                <MenuItem value="MongoDB">MongoDB</MenuItem>
                <MenuItem value="Firebase">Firebase</MenuItem>
              </TextField>
            </Box>
            <TextField
              label="Integrations needed"
              name="integrations"
              value={form.integrations}
              onChange={handleChange}
              placeholder="e.g. Razorpay, Google Maps, SendGrid, Twilio, Google OAuth..."
              multiline
              rows={3}
              fullWidth
              sx={fieldSx}
            />
          </Box>
        )}

        {/* STEP 5 */}
        {currentStep === 5 && (
          <Box>
            <Typography sx={{ ...labelSx, mb: 1.5, display: 'block' }}>
              Marketing services to include
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1 }}>
              {['On-page SEO setup', 'Google Analytics + Search Console',
                'Google My Business', 'Social media pages setup',
                'Email marketing (Mailchimp)', 'Blog / content marketing',
                'Google Ads campaign', 'Meta Ads (Facebook/Instagram)'].map(opt => (
                <FormControlLabel
                  key={opt}
                  sx={{
                    m: 0,
                    p: 1.5,
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    transition: 'border-color 0.15s',
                    '&:hover': { borderColor: 'var(--blue)' },
                    '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: 'var(--text-secondary)' },
                  }}
                  control={
                    <Checkbox
                      checked={form.marketing.includes(opt)}
                      onChange={() => handleCheckbox('marketing', opt)}
                      size="small"
                      sx={{ color: 'var(--border)', '&.Mui-checked': { color: 'var(--blue)' }, p: 0.5, mr: 0.5 }}
                    />
                  }
                  label={opt}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* STEP 6 */}
        {currentStep === 6 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
              <TextField
                select
                label="Cloud provider"
                name="cloud"
                value={form.cloud}
                onChange={handleChange}
                size="small"
                fullWidth
                sx={fieldSx}
              >
                <MenuItem value="Vercel + Railway">Vercel + Railway</MenuItem>
                <MenuItem value="AWS">AWS</MenuItem>
                <MenuItem value="Google Cloud">Google Cloud</MenuItem>
                <MenuItem value="Azure">Azure</MenuItem>
              </TextField>
              <TextField
                select
                label="Timeline"
                name="timeline"
                value={form.timeline}
                onChange={handleChange}
                size="small"
                fullWidth
                sx={fieldSx}
              >
                <MenuItem value="6-8 weeks">6-8 weeks</MenuItem>
                <MenuItem value="8-10 weeks">8-10 weeks</MenuItem>
                <MenuItem value="10-14 weeks">10-14 weeks</MenuItem>
                <MenuItem value="Flexible">Flexible</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
              <TextField
                select
                label="Post-launch support"
                name="support"
                value={form.support}
                onChange={handleChange}
                size="small"
                fullWidth
                sx={fieldSx}
              >
                <MenuItem value="Yes - 3 months">Yes - 3 months</MenuItem>
                <MenuItem value="Yes - 6 months">Yes - 6 months</MenuItem>
                <MenuItem value="No, one-time">No, one-time</MenuItem>
              </TextField>
            </Box>
          </Box>
        )}

        {/* AI Suggestion Box */}
        <Box sx={{ mt: 2.5, borderTop: '1px solid var(--border-light)', pt: 2 }}>
          <Button
            onClick={getAISuggestion}
            disabled={aiLoading}
            disableElevation
            startIcon={
              aiLoading
                ? <CircularProgress size={14} sx={{ color: 'var(--blue)' }} />
                : <Box component="span">✦</Box>
            }
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--blue)',
              p: 0,
              minWidth: 0,
              '&:hover': { bgcolor: 'transparent', color: 'var(--blue-dark)' },
              '&.Mui-disabled': { color: 'var(--blue)', opacity: 0.5 },
            }}
          >
            {aiLoading ? 'Getting AI suggestion...' : 'Get AI suggestion for this step'}
          </Button>

          {suggestion && (
            <Paper
              elevation={0}
              sx={{ mt: 1.5, bgcolor: 'var(--blue-light)', border: '1px solid var(--blue)', borderRadius: '12px', p: 2 }}
            >
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)', mb: 1 }}>
                ✦ AI recommendation
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'var(--blue-dark)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {suggestion}
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            onClick={handleBack}
            disabled={currentStep === 1}
            variant="outlined"
            disableElevation
            sx={{
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.875rem',
              '&:hover': { bgcolor: 'var(--bg-tertiary)', borderColor: 'var(--border)' },
              '&.Mui-disabled': { opacity: 0.3 },
            }}
          >
            ← Back
          </Button>
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Step {currentStep} of {steps.length}
          </Typography>
          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={loading}
              variant="contained"
              disableElevation
              sx={{
                bgcolor: 'var(--blue)',
                color: '#fff',
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
                '&:hover': { bgcolor: 'var(--blue-dark)' },
              }}
            >
              {loading ? 'Saving...' : 'Next →'}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              variant="contained"
              disableElevation
              sx={{
                bgcolor: '#16a34a',
                color: '#fff',
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
                '&:hover': { bgcolor: '#15803d' },
              }}
            >
              {loading ? 'Submitting...' : 'Submit project ✓'}
            </Button>
          )}
        </Box>

      </Paper>
    </Box>
  )
}
