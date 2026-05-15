'use client'
import { useState, useRef, useEffect } from 'react'
import API_URL from '@/lib/config'

const quickChips = [
  'What tech stack for a travel booking app?',
  'How long to build a full portal?',
  'What is included in delivery?',
  'How does pricing work?',
  'Do you provide SEO support?',
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the DevLaunch AI assistant. I can help with tech stacks, timelines, cost estimates, and anything about building your application. What would you like to know?",
    },
  ])
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [escalated, setEscalated] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text?: string) {
    const userMsg = text || input.trim()
    if (!userMsg) return

    setInput('')
    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const history = newMessages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch(API_URL + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history,
        }),
      })

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])

    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Make sure the backend is running on port 5000.',
      }])
    }

    setLoading(false)
  }

  function handleEscalate() {
    setEscalated(true)
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: 'Connecting you to a human agent now. A team member will reach out to you within 2-5 minutes via email. In the meantime, feel free to continue describing your requirements.',
    }])
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header card */}
      <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">

        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
          <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center text-sm font-bold flex-shrink-0">
            AI
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-[var(--text-primary)]">DevLaunch AI assistant</div>
            <div className="text-xs text-green-600">● Online · Powered by Claude</div>
          </div>
          {!escalated && (
            <button
              onClick={handleEscalate}
              className="text-xs px-3 py-1.5 border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] cursor-pointer"
            >
              Talk to human
            </button>
          )}
        </div>

        {/* Quick chips */}
        <div className="px-5 pt-4 flex flex-wrap gap-2">
          {quickChips.map(chip => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              className="text-xs px-3 py-1.5 border border-[var(--border)] rounded-full text-[var(--text-muted)] hover:bg-[var(--blue-light)] hover:text-[var(--blue)] hover:border-[var(--blue)] transition-all cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="px-5 py-4 flex flex-col gap-4 min-h-[350px] max-h-[500px] overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                  AI
                </div>
              )}
              <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                ${m.role === 'user'
                  ? 'bg-[var(--blue)] text-white rounded-br-sm'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-bl-sm border border-[var(--border)]'
                }`}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                AI
              </div>
              <div className="bg-[var(--bg-tertiary)] px-4 py-3 rounded-2xl rounded-bl-sm border border-[var(--border)]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-[var(--border)] flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask anything about your project..."
            className="flex-1 px-4 py-2.5 text-sm border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-xl outline-none focus:border-[var(--blue)] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-[var(--blue)] text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  )
}