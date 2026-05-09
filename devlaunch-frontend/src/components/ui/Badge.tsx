export default function Badge({ children, color = 'blue' }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-800',
    green:  'bg-green-50 text-green-800',
    amber:  'bg-amber-50 text-amber-800',
    red:    'bg-red-50 text-red-800',
    purple: 'bg-purple-50 text-purple-800',
    gray:   'bg-gray-100 text-gray-600',
    teal:   'bg-teal-50 text-teal-800',
  }

  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors[color]}`}>
      {children}
    </span>
  )
}