'use client'
import { useState, useRef, useEffect } from 'react'

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
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text) {
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

      const res = await fetch('http://localhost:5000/api/chat', {
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
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
            AI
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-gray-900">DevLaunch AI assistant</div>
            <div className="text-xs text-green-600">● Online · Powered by Claude</div>
          </div>
          {!escalated && (
            <button
              onClick={handleEscalate}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
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
              className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="px-5 py-4 flex flex-col gap-4 min-h-64 max-h-96 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                  AI
                </div>
              )}
              <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                ${m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                AI
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
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
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask anything about your project..."
            className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  )
}