'use client'
import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'

export default function Topbar() {
  return (
    <div className="bg-white px-12 py-8 flex items-center justify-between flex-shrink-0">


      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">Your AI-powered delivery platform</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          Live
        </span>
        <Link href="/chatbot">
          <button className="text-sm px-5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-semibold transition-all cursor-pointer">
            Ask AI
          </button>
        </Link>
        <Link href="/wizard">
          <button className="text-sm px-5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-semibold transition-all cursor-pointer">
            Start project
          </button>
        </Link>
        <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 transition-all cursor-pointer">
          <MoreHorizontal size={20} />
        </button>
      </div>

    </div>
  )
}