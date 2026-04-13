'use client'
import Link from 'next/link'

export default function Topbar() {
  return (
    <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between flex-shrink-0">

      {/* Left */}
      <div>
        <div className="text-[13px] font-bold text-gray-900">Welcome back</div>
        <div className="text-[11px] text-gray-400 mt-0.5">Your AI-powered delivery platform</div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          Live
        </span>
        <Link href="/chatbot">
          <button className="text-[11px] px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium cursor-pointer transition-colors">
            Ask AI
          </button>
        </Link>
        <Link href="/wizard">
          <button className="text-[11px] px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium cursor-pointer transition-colors">
            Start project
          </button>
        </Link>
      </div>

    </div>
  )
}