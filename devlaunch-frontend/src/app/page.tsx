// 'use client'
// import Link from 'next/link'
// import { ArrowRight, Plane, ShoppingCart, Activity, GraduationCap, Layout, Target } from 'lucide-react'

// const metrics = [
//   { label: 'Projects delivered', value: '48',   change: '↑ 6 this quarter', color: 'text-green-600' },
//   { label: 'Happy clients',      value: '41',   change: '↑ 4 this month',   color: 'text-green-600' },
//   { label: 'Avg. rating',        value: '4.9★', change: '41 reviews',       color: 'text-green-600' },
//   { label: 'Industries served',  value: '12',   change: 'Travel, Health...', color: 'text-blue-600' },
// ]

// const categories = [
//   {
//     icon: <Plane className="text-blue-500" size={24} />,
//     name: 'Travel & Hospitality',
//     desc: 'Booking portals, itinerary apps, tour management systems.',
//     tags: ['Web app', 'Mobile', 'CMS'],
//   },
//   {
//     icon: <ShoppingCart className="text-orange-500" size={24} />,
//     name: 'E-commerce',
//     desc: 'Multi-vendor stores, inventory, payment integrations.',
//     tags: ['Web app', 'Admin', 'SEO'],
//   },
//   {
//     icon: <Activity className="text-red-500" size={24} />,
//     name: 'Healthcare',
//     desc: 'Patient portals, telemedicine, appointment booking.',
//     tags: ['Web app', 'Mobile'],
//   },
//   {
//     icon: <GraduationCap className="text-purple-500" size={24} />,
//     name: 'EdTech',
//     desc: 'LMS platforms, quiz engines, video course portals.',
//     tags: ['Web app', 'API'],
//   },
//   {
//     icon: <Layout className="text-emerald-500" size={24} />,
//     name: 'SaaS / Dashboards',
//     desc: 'B2B tools, analytics portals, CRM systems.',
//     tags: ['Web app', 'API'],
//   },
//   {
//     icon: <Target className="text-rose-500" size={24} />,
//     name: 'Marketing & Growth',
//     desc: 'Landing pages, SEO sites, ad campaigns.',
//     tags: ['SEO', 'Ads'],
//   },
// ]

// const stack = [
//   { label: 'Frontend',   items: ['Next.js', 'React Native', 'Flutter'] },
//   { label: 'Backend',    items: ['Node.js', 'FastAPI', 'Django'] },
//   { label: 'Database',   items: ['PostgreSQL', 'MongoDB', 'Redis'] },
//   { label: 'Cloud & AI', items: ['AWS', 'Vercel', 'Claude API'] },
// ]

// export default function HomePage() {
//   return (
//     <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">


//       {/* Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
//         {metrics.map((m) => (
//           <div key={m.label} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
//             <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">{m.value}</div>
//             <div className="text-[13px] font-medium text-[var(--text-muted)] mb-3">{m.label}</div>
//             <div className={`text-[11px] font-semibold px-2 py-1 rounded-full inline-block bg-[var(--bg-tertiary)] ${m.color}`}>
//               {m.change}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Categories Section */}
//       <div className="mb-10">
//         <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-6">
//           What can we build for you?
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//           {categories.map((cat) => (
//             <div
//               key={cat.name}
//               className="group bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--blue)] hover:shadow-xl transition-all cursor-pointer"
//             >
//               <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[var(--blue-light)] transition-colors">
//                 {cat.icon}
//               </div>
//               <div className="text-lg font-bold text-[var(--text-primary)] mb-2">{cat.name}</div>
//               <div className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 h-10 overflow-hidden">
//                 {cat.desc}
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {cat.tags.map((tag) => (
//                   <span key={tag} className="text-[11px] font-semibold px-3 py-1.5 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-full group-hover:bg-[var(--blue-light)] group-hover:text-[var(--blue)] transition-colors">
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Tech Stack Section */}
//       <div className="mb-10">
//         <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-6">
//           Our technology stack
//         </div>
//         <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-3xl p-8 shadow-sm">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {stack.map((s) => (
//               <div key={s.label}>
//                 <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">{s.label}</div>
//                 <div className="flex flex-wrap gap-2">
//                   {s.items.map((item) => (
//                     <span key={item} className="text-xs font-medium px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-xl hover:opacity-80 transition-colors cursor-default">
//                       {item}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* CTA Banner */}
//       <div className="bg-[var(--blue)] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
//         <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full opacity-20 blur-3xl group-hover:scale-110 transition-transform duration-700" />
//         <div className="relative z-10">
//           <h2 className="text-2xl font-bold text-white mb-2">Ready to build your project?</h2>
//           <p className="text-blue-100 opacity-90">Go through our 6-step AI wizard and get a proposal in minutes.</p>
//         </div>
//         <Link href="/wizard" className="relative z-10 w-full md:w-auto">
//           <button className="w-full bg-white text-[var(--blue)] font-bold px-8 py-4 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 cursor-pointer">
//             Start project
//             <ArrowRight size={20} />
//           </button>
//         </Link>
//       </div>

//     </div>
//   )
// }
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X, ArrowRight, CheckCircle, Star, ChevronDown } from 'lucide-react'

// ── Nav ────────────────────────────────────────────────
function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted,    setMounted]    = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Services',   href: '#services'   },
    { label: 'Industries', href: '#industries' },
    { label: 'Process',    href: '#process'    },
    { label: 'Portfolio',  href: '#portfolio'  },
    { label: 'Pricing',    href: '#pricing'    },
    { label: 'Reviews',    href: '#reviews'    },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800'
        : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
          Dev<span className="text-gray-900 dark:text-white">Launch</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <a key={l.href} href={l.href}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}
          <Link href="/login">
            <button className="hidden md:block text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Sign in
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Get started free
            </button>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-4">
          {navLinks.map(l => (
            <a key={l.href} href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm font-medium text-gray-600 dark:text-gray-300 border-b border-gray-50 dark:border-gray-800">
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 pt-4">
            <Link href="/login" className="flex-1">
              <button className="w-full py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300">
                Sign in
              </button>
            </Link>
            <Link href="/register" className="flex-1">
              <button className="w-full py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">
                Get started
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

// ── Hero ───────────────────────────────────────────────
function Hero() {
  return (
    <section className="pt-24 pb-20 px-6 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-5xl mx-auto text-center">

        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold px-4 py-2 rounded-full mb-8 border border-blue-100 dark:border-blue-900">
          🚀 India's AI-powered software delivery platform
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tight mb-6">
          We Build Digital Products<br />
          <span className="text-blue-600 dark:text-blue-400">That Grow Your Business</span>
        </h1>

        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          From dental clinics to real estate — we deliver full-stack web and mobile applications
          with AI automation in 6-10 weeks. Onboard yourself in 10 minutes with our AI wizard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/register">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900">
              Start project wizard
              <ArrowRight size={18} />
            </button>
          </Link>
          <a href="#portfolio">
            <button className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold px-8 py-4 rounded-2xl text-base border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all">
              View our work
            </button>
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { num: '48+',    label: 'Projects delivered' },
            { num: '40+',    label: 'Happy clients'       },
            { num: '6-10',   label: 'Weeks delivery'      },
            { num: '4.9★',   label: 'Client rating'       },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{s.num}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Tech strip ────────────────────────────────────────
function TechStrip() {
  const techs = ['⚛️ React / Next.js', '🟢 Node.js', '🐘 PostgreSQL', '📱 React Native', '☁️ AWS / Vercel', '🤖 AI / LLM', '🔥 Firebase', '🐳 Docker']
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 border-y border-gray-100 dark:border-gray-800 py-4">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-6 justify-center">
        {techs.map(t => (
          <span key={t} className="text-sm font-semibold text-gray-400 dark:text-gray-500">{t}</span>
        ))}
      </div>
    </div>
  )
}

// ── Services ─────────────────────────────────────────
function Services() {
  const services = [
    { icon: '🌐', title: 'Web application',      desc: 'Custom portals, dashboards, booking systems and management platforms.',         tags: ['Next.js', 'Node.js', 'PostgreSQL'], color: 'bg-blue-50 dark:bg-blue-950/50' },
    { icon: '📱', title: 'Mobile application',   desc: 'iOS and Android apps with offline support and push notifications.',            tags: ['React Native', 'Flutter', 'Firebase'], color: 'bg-green-50 dark:bg-green-950/50' },
    { icon: '🤖', title: 'AI automation',         desc: 'Automate tasks, add AI chatbots, smart recommendations and workflows.',       tags: ['LLM', 'LangChain', 'Ollama'],          color: 'bg-purple-50 dark:bg-purple-950/50' },
    { icon: '🛒', title: 'E-commerce platform',   desc: 'Multi-vendor stores, inventory, payment gateway and order tracking.',         tags: ['Razorpay', 'Stripe', 'Admin panel'],   color: 'bg-amber-50 dark:bg-amber-950/50' },
    { icon: '📣', title: 'Digital marketing',     desc: 'SEO optimization, Google Ads, social media and landing pages.',               tags: ['SEO', 'Google Ads', 'Meta Ads'],       color: 'bg-pink-50 dark:bg-pink-950/50' },
    { icon: '🔧', title: 'Maintenance & support', desc: 'Monthly plans, bug fixes, feature updates and 24/7 technical support.',       tags: ['₹3,000/mo', 'Support', 'Updates'],    color: 'bg-teal-50 dark:bg-teal-950/50' },
  ]

  return (
    <section id="services" className="py-20 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">What we build</div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">End-to-end software<br />delivery services</h2>
          </div>
          <p className="text-gray-400 dark:text-gray-500 max-w-sm mt-4 md:mt-0 leading-relaxed text-sm">
            We handle everything — design, development, deployment and maintenance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => (
            <div key={s.title} className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-lg transition-all cursor-pointer">
              <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center text-2xl mb-5`}>
                {s.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map(t => (
                  <span key={t} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Industries ────────────────────────────────────────
function Industries() {
  const industries = [
    { icon: '🏥', name: 'Healthcare & Dental',    desc: 'Appointment booking, patient management, telemedicine'       },
    { icon: '🏗️', name: 'Real Estate & Builders', desc: 'Property listings, lead management, project tracking'        },
    { icon: '✈️', name: 'Travel & Hospitality',   desc: 'Booking systems, itinerary apps, tour management'            },
    { icon: '🎓', name: 'Education & EdTech',      desc: 'LMS platforms, fee management, attendance tracking'          },
    { icon: '🛒', name: 'Retail & E-commerce',     desc: 'Online stores, inventory, multi-vendor marketplace'          },
    { icon: '🍽️', name: 'Restaurant & Food',       desc: 'Online ordering, table booking, kitchen management'          },
    { icon: '💼', name: 'CA & Finance',            desc: 'Client portal, document management, billing system'          },
    { icon: '🏭', name: 'Manufacturing',           desc: 'Inventory tracking, order management, supply chain'          },
  ]

  return (
    <section id="industries" className="py-20 px-6 bg-gray-50 dark:bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Industries we serve</div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Built for every industry</h2>
          <p className="text-gray-400 dark:text-gray-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            From healthcare to real estate — we understand your specific needs and compliance requirements.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {industries.map(ind => (
            <div key={ind.name} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 text-center hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer group">
              <div className="text-3xl mb-3">{ind.icon}</div>
              <div className="text-sm font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{ind.name}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{ind.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Process ───────────────────────────────────────────
function Process() {
  const steps = [
    { num: '01', title: 'AI wizard',     desc: 'Fill 6 steps. Get instant tech stack + cost estimate',  color: 'bg-blue-600'   },
    { num: '02', title: 'Proposal',      desc: 'AI generates full proposal PDF in 30 seconds',          color: 'bg-indigo-600' },
    { num: '03', title: 'Design',        desc: 'Figma prototypes shared for your approval',             color: 'bg-purple-600' },
    { num: '04', title: 'Development',   desc: 'Frontend + backend built in parallel',                  color: 'bg-pink-600'   },
    { num: '05', title: 'Testing',       desc: 'Full QA + client feedback rounds',                      color: 'bg-orange-600' },
    { num: '06', title: 'Live & support', desc: 'Deployed with CI/CD + monthly maintenance',            color: 'bg-green-600'  },
  ]

  return (
    <section id="process" className="py-20 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">How it works</div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">From idea to live<br />in 6-10 weeks</h2>
          <p className="text-gray-400 dark:text-gray-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Our AI-guided platform captures your requirements and delivers your product — with full transparency at every step.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((s, i) => (
            <div key={s.num} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-3/4 w-1/2 h-px bg-gray-200 dark:bg-gray-700 z-0" />
              )}
              <div className={`${s.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm mx-auto mb-4 relative z-10`}>
                {s.num}
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white mb-2">{s.title}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Why us bullets */}
        <div className="mt-16 bg-blue-600 dark:bg-blue-700 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🤖', title: 'AI wizard onboarding',     desc: 'No calls, no emails. Clients onboard themselves in 10 minutes with our AI wizard.' },
            { icon: '📊', title: 'Live project tracker',     desc: 'Clients see every milestone in real time. Zero black box. Full transparency.'       },
            { icon: '⚡', title: 'Instant proposal PDF',     desc: 'AI generates scope, timeline and cost breakdown in 30 seconds — not 5 days.'       },
          ].map(w => (
            <div key={w.title} className="flex gap-4">
              <div className="text-2xl flex-shrink-0">{w.icon}</div>
              <div>
                <div className="text-sm font-bold text-white mb-1">{w.title}</div>
                <div className="text-xs text-blue-200 leading-relaxed">{w.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Portfolio ─────────────────────────────────────────
function Portfolio() {
  const projects = [
    { emoji: '✈️', bg: 'bg-blue-50 dark:bg-blue-950/50',   badge: 'Delivered', badgeColor: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400', title: 'TravelNest booking portal',   subtitle: 'Flight + hotel + tour management',   desc: 'Full-stack booking platform with real-time availability, Razorpay payments and admin CMS. Built in 8 weeks.',        tags: ['React', 'Node.js', 'PostgreSQL', 'AWS']       },
    { emoji: '🏥', bg: 'bg-green-50 dark:bg-green-950/50',  badge: 'Live',      badgeColor: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400',   title: 'MediBook healthcare portal',  subtitle: 'Telemedicine + appointments',         desc: 'Multi-doctor video consultation, e-prescriptions, HIPAA-compliant architecture.',                                   tags: ['Vue.js', 'Django', 'WebRTC']                  },
    { emoji: '🛒', bg: 'bg-purple-50 dark:bg-purple-950/50', badge: 'Growing',  badgeColor: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-400', title: 'ShopX e-commerce marketplace', subtitle: 'Multi-vendor marketplace',          desc: 'Seller dashboard, AI recommendations, SEO-optimized pages and warehouse integrations.',                             tags: ['Next.js', 'Node.js', 'MongoDB']               },
    { emoji: '🎓', bg: 'bg-amber-50 dark:bg-amber-950/50',  badge: 'Delivered', badgeColor: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400', title: 'EdQuest learning platform',   subtitle: 'Full LMS platform',                  desc: 'Video courses, quiz engine, student dashboard, instructor panel and certificate generation.',                        tags: ['React', 'Django', 'AWS S3']                   },
  ]

  return (
    <section id="portfolio" className="py-20 px-6 bg-gray-50 dark:bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Our work</div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Projects we've delivered</h2>
          </div>
          <p className="text-gray-400 dark:text-gray-500 max-w-sm mt-4 md:mt-0 text-sm leading-relaxed">
            Real products for real businesses across India.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(p => (
            <div key={p.title} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
              <div className={`${p.bg} h-44 flex items-center justify-center text-6xl`}>
                {p.emoji}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">{p.title}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{p.subtitle}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: 'Starter', price: '₹2,999', period: '/month',
      desc: 'Perfect for small businesses getting started',
      features: ['Web application (5 pages)', 'Mobile responsive', 'Basic admin panel', 'Contact form + WhatsApp', 'SSL + hosting', 'Email support'],
      cta: 'Get started', featured: false,
    },
    {
      name: 'Professional', price: '₹5,999', period: '/month',
      desc: 'For growing businesses needing full features',
      features: ['Full web application', 'Mobile app (iOS + Android)', 'Advanced admin panel', 'Razorpay payment gateway', 'AI chatbot integration', 'SEO optimization', 'Priority support'],
      cta: 'Get started', featured: true,
    },
    {
      name: 'Enterprise', price: '₹9,999', period: '/month',
      desc: 'For established businesses needing custom solutions',
      features: ['Custom web + mobile app', 'AI automation workflows', 'Multi-location support', 'ERP / CRM integration', 'Dedicated developer', '40 hours/month', '24/7 support'],
      cta: 'Contact us', featured: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Transparent pricing</div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Simple monthly plans</h2>
          <p className="text-gray-400 dark:text-gray-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            No hidden charges. Cancel anytime. All plans include hosting, SSL and basic support.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.name} className={`relative rounded-2xl p-8 transition-all
              ${plan.featured
                ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-xl shadow-blue-200 dark:shadow-blue-900 scale-105'
                : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg'
              }`}>
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.featured ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
                {plan.name}
              </div>
              <div className={`text-4xl font-black mb-1 ${plan.featured ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {plan.price}
                <span className={`text-base font-normal ${plan.featured ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
                  {plan.period}
                </span>
              </div>
              <div className={`text-sm mb-6 ${plan.featured ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
                {plan.desc}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-center gap-2 text-sm ${plan.featured ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                    <CheckCircle size={14} className={plan.featured ? 'text-blue-300' : 'text-blue-600 dark:text-blue-400'} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all
                  ${plan.featured
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Reviews ───────────────────────────────────────────
function Reviews() {
  const reviews = [
    { initials: 'RK', bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', name: 'Rajesh Kumar',    company: 'TravelNest Agency, Varanasi', rating: 5, review: '"They built our entire travel portal in 8 weeks. The AI wizard was incredible — they understood our requirements perfectly. Best tech team in India."' },
    { initials: 'DM', bg: 'bg-blue-100 dark:bg-blue-900',   text: 'text-blue-800 dark:text-blue-200',   name: 'Dr. Meena Sharma', company: 'Sharma Dental Clinic, Lucknow', rating: 5, review: '"Our clinic\'s appointment system is fully automated now. Patients book online, we get notifications. No more missed appointments. Worth every rupee."' },
    { initials: 'MV', bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200', name: 'Mohammed Viqar', company: 'ShopX Marketplace, Delhi', rating: 5, review: '"Our sales increased 3x after DevLaunch built our platform. The AI product recommendations are amazing. Very professional team."' },
  ]

  return (
    <section id="reviews" className="py-20 px-6 bg-gray-50 dark:bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Client reviews</div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">What our clients say</h2>
          <div className="flex items-center justify-center gap-1 mt-4">
            {[1,2,3,4,5].map(i => <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />)}
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-2">4.9 / 5 from 40+ clients</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(r => (
            <div key={r.name} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-md transition-all">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic mb-6">{r.review}</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${r.bg} ${r.text} flex items-center justify-center text-xs font-black`}>
                  {r.initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{r.name}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{r.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-20 px-6 bg-blue-600 dark:bg-blue-700">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
          Ready to build your product?
        </h2>
        <p className="text-blue-200 text-lg mb-10 leading-relaxed">
          Go through our 6-step AI wizard and get a detailed proposal with timeline
          and cost estimate within 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <button className="flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl text-base hover:bg-blue-50 transition-all">
              Start project wizard
              <ArrowRight size={18} />
            </button>
          </Link>
          <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noreferrer">
            <button className="flex items-center gap-2 bg-transparent text-white font-bold px-8 py-4 rounded-2xl text-base border-2 border-white/40 hover:border-white/70 transition-all">
              💬 WhatsApp us
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-950 dark:bg-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="text-xl font-black text-blue-400 mb-3">DevLaunch</div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              India's AI-powered software delivery platform for SMEs and growing businesses.
            </p>
            <div className="flex gap-2">
              {['in', 'tw', 'ig', 'wa'].map(s => (
                <div key={s} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-xs text-gray-400 cursor-pointer transition-colors">
                  {s}
                </div>
              ))}
            </div>
          </div>
          {[
            { title: 'Services',   links: ['Web development', 'Mobile apps', 'AI automation', 'E-commerce', 'Digital marketing'] },
            { title: 'Industries', links: ['Healthcare', 'Real estate', 'Travel', 'Education', 'Restaurant'] },
            { title: 'Company',    links: ['About us', 'Portfolio', 'Pricing', 'Blog', 'Contact'] },
          ].map(col => (
            <div key={col.title}>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{col.title}</div>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-500">© 2026 DevLaunch. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300">Terms of Service</a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Main page ─────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <Hero />
      <TechStrip />
      <Services />
      <Industries />
      <Process />
      <Portfolio />
      <Pricing />
      <Reviews />
      <CTA />
      <Footer />
    </div>
  )
}