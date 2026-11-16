// Site-wide notice that portfolio items, testimonials and stats are sample content.
// Set NEXT_PUBLIC_DEMO_MODE=false once they are replaced with real, verifiable data.
export default function DemoBanner() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'false') return null
  return (
    <div
      role="note"
      style={{
        background: '#fef3c7',
        color: '#78350f',
        borderBottom: '1px solid #fcd34d',
        fontSize: '0.8125rem',
        fontWeight: 600,
        textAlign: 'center',
        padding: '6px 16px',
      }}
    >
      Portfolio project · Testimonials, portfolio items and stats shown here are sample data.
    </div>
  )
}
