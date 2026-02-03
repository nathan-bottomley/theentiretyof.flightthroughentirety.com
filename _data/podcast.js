import Fetch from '@11ty/eleventy-fetch'
import { XMLParser } from 'fast-xml-parser'
import podcasts from './podcasts.json' with { type: 'json' }

const author = 'Flight Through Entirety'

const startYear = 2026
const currentYear = new Date().getFullYear()
let copyrightNotice
if (startYear === currentYear) {
  copyrightNotice = `© ${startYear} ${author}`
} else {
  copyrightNotice = `© ${startYear}–${currentYear} ${author}`
}

async function fetchEpisodes() {
  const episodesByPodcast = await Promise.all(
    podcasts.map(async (podcast) => {
      let feed
      try {
        feed = await Fetch(podcast.feedUrl, {
          duration: '1d',
          type: 'xml'
        })
      } catch (error) {
        throw new Error(`Failed to fetch feed for ${podcast.name}: ${error.message}`)
      }

      const parser = new XMLParser({ ignoreAttributes: false })
      let parsed
      try {
        parsed = parser.parse(feed)
      } catch (error) {
        throw new Error(`Failed to parse XML for ${podcast.name}: ${error.message}`)
      }

      const feedEpisodes = parsed.rss?.channel?.item
      if (!feedEpisodes) {
        throw new Error(`Feed for ${podcast.name} has no episodes (missing rss.channel.item)`)
      }

      for (const episode of feedEpisodes) {
        episode['itunes:title'] = `${podcast.abbreviation}: ${episode.title}`
        if (episode['itunes:season']) {
          episode.title = `${podcast.abbreviation} S${episode['itunes:season']}E${episode['itunes:episode']}: ${episode.title}`
        } else if (episode['itunes:episode']) {
          episode.title = `${podcast.abbreviation} ${episode['itunes:episode']}: ${episode.title}`
        } else {
          episode.title = `${podcast.abbreviation}: ${episode.title}`
        }
      }
      return feedEpisodes
    })
  )

  const episodes = episodesByPodcast.flat()
  episodes.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
  return episodes
}

function calculateStats(episodes) {
  const totalSize = episodes.reduce((sum, ep) => sum + (parseInt(ep.enclosure?.['@_length']) || 0), 0)

  const totalDuration = episodes.reduce((sum, ep) => {
    const duration = ep['itunes:duration']
    if (!duration) return sum
    if (typeof duration === 'number') return sum + duration
    const parts = String(duration).split(':').map(Number)
    if (parts.length === 3) return sum + parts[0] * 3600 + parts[1] * 60 + parts[2]
    if (parts.length === 2) return sum + parts[0] * 60 + parts[1]
    return sum + (parseInt(duration) || 0)
  }, 0)

  return {
    numberOfEpisodes: episodes.length,
    totalSize,
    totalDuration
  }
}

export default async function () {
  const episodes = await fetchEpisodes()
  const { numberOfEpisodes, totalSize, totalDuration } = calculateStats(episodes)

  return {
    feedUrl: 'https://theentiretyof.flightthroughentirety.com/feed/podcast.xml',
    siteUrl: 'https://theentiretyof.flightthroughentirety.com/',
    title: 'The Entirety of Flight Through Entirety: A Doctor Who Podcast Collection',
    description: 'All of the Flight Through Entirety Doctor Who podcasts, together at last',
    language: 'en',
    imageUrl: 'https://theentiretyof.flightthroughentirety.com/img/podcast-logo.jpg',
    category: 'TV & Film',
    subcategory: 'TV Reviews',
    author,
    copyrightNotice,
    feedLastBuildDate: new Date().toISOString(),
    owner: {
      name: 'Nathan Bottomley',
      email: 'nathan.bottomley@gmail.com'
    },
    episodes,
    numberOfEpisodes,
    totalSize,
    totalDuration
  }
}
