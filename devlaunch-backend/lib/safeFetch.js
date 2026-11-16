// SSRF protection for server-side fetches of user-supplied URLs (the website audit).
//
// The check runs inside the socket's DNS lookup, so it also covers redirects and
// DNS rebinding: whatever IP we actually connect to is the IP we validated.

const dns = require('dns')
const net = require('net')
const http = require('http')
const https = require('https')

const blockList = new net.BlockList()
// IPv4
blockList.addSubnet('0.0.0.0', 8, 'ipv4')
blockList.addSubnet('10.0.0.0', 8, 'ipv4')
blockList.addSubnet('100.64.0.0', 10, 'ipv4') // carrier-grade NAT
blockList.addSubnet('127.0.0.0', 8, 'ipv4')
blockList.addSubnet('169.254.0.0', 16, 'ipv4') // link-local, incl. cloud metadata 169.254.169.254
blockList.addSubnet('172.16.0.0', 12, 'ipv4')
blockList.addSubnet('192.168.0.0', 16, 'ipv4')
blockList.addSubnet('198.18.0.0', 15, 'ipv4')
blockList.addSubnet('224.0.0.0', 4, 'ipv4') // multicast
blockList.addSubnet('240.0.0.0', 4, 'ipv4') // reserved
// IPv6
blockList.addAddress('::', 'ipv6')
blockList.addAddress('::1', 'ipv6')
blockList.addSubnet('fc00::', 7, 'ipv6') // unique local
blockList.addSubnet('fe80::', 10, 'ipv6') // link-local
blockList.addSubnet('ff00::', 8, 'ipv6') // multicast

function isPrivateAddress(address) {
  const family = net.isIP(address)
  if (family === 0) return true // not an IP at all: refuse
  if (family === 6) {
    const mapped = address.toLowerCase().match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
    if (mapped) return blockList.check(mapped[1], 'ipv4')
    return blockList.check(address, 'ipv6')
  }
  return blockList.check(address, 'ipv4')
}

class BlockedAddressError extends Error {
  constructor(hostname) {
    super(`Refusing to connect to a private or reserved address (${hostname})`)
    this.code = 'EBLOCKEDADDRESS'
  }
}

function safeLookup(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err)
    const list = Array.isArray(addresses) ? addresses : [{ address: addresses, family: options.family || 4 }]
    if (list.length === 0 || list.some(a => isPrivateAddress(a.address))) {
      return callback(new BlockedAddressError(hostname))
    }
    if (options.all) return callback(null, list)
    callback(null, list[0].address, list[0].family)
  })
}

const httpAgent = new http.Agent({ lookup: safeLookup })
const httpsAgent = new https.Agent({ lookup: safeLookup })

// Only plain web ports; blocks probing of internal services on odd ports.
function isAllowedUrl(href) {
  try {
    const u = new URL(href)
    if (!['http:', 'https:'].includes(u.protocol)) return false
    if (u.username || u.password) return false
    if (u.port && !['80', '443'].includes(u.port)) return false
    // Node skips the DNS lookup for literal IPs, so check them here as well.
    const host = u.hostname.replace(/^\[|\]$/g, '')
    if (net.isIP(host) && isPrivateAddress(host)) return false
    return true
  } catch {
    return false
  }
}

module.exports = { httpAgent, httpsAgent, isAllowedUrl, isPrivateAddress, BlockedAddressError }
