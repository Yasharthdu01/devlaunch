// Escape user-supplied text before putting it into HTML (e.g. notification
// emails), so a name like <a href="evil">click</a> renders as text.
const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

module.exports = function escapeHtml(value) {
  if (value === null || value === undefined) return ''
  return String(value).replace(/[&<>"']/g, ch => MAP[ch])
}
