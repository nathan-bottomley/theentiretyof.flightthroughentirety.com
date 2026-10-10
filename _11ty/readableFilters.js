function pluralise (value, unit) {
  return `${value} ${unit}${value === 1 ? '' : 's'}`
}

function longFormat (seconds) {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.round((seconds % 60) * 1000) / 1000
  return [pluralise(d, 'day'), pluralise(h, 'hour'), pluralise(m, 'minute'), pluralise(s, 'second')].join(', ')
}

function shortFormat (seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h === 0) {
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function (eleventyConfig, options = {}) {
  eleventyConfig.addFilter('readableDate', function (date) {
    const readableDateLocale = options.readableDateLocale ?? 'en-AU'
    return new Date(date).toLocaleDateString(readableDateLocale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    })
  })

  eleventyConfig.addFilter('readableDuration', (seconds, length) => {
    if (!seconds) return '0:00'
    if (length === 'long') {
      return longFormat(seconds)
    }
    return shortFormat(seconds)
  })

  eleventyConfig.addFilter('readableSize', (bytes, fixedPrecision = 1) => {
    if (isNaN(bytes)) return 'NaN kB'
    if (bytes === 0) return '0 kB'
    if (bytes < 1000 * 1000) return `${(bytes / 1000).toFixed(fixedPrecision)} kB`
    if (bytes < 1000 * 1000 * 1000) return `${(bytes / 1000 / 1000).toFixed(fixedPrecision)} MB`
    return `${(bytes / 1000 / 1000 / 1000).toFixed(fixedPrecision)} GB`
  })
}
