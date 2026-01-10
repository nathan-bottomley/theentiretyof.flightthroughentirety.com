import Fetch from '@11ty/eleventy-fetch'
import { XMLParser } from 'fast-xml-parser'

const podcasts = [
  {
    url: 'https://flightthroughentirety.com/feed/podcast',
    abbreviation: 'FTE'
  },
  {
    url: 'https://500yeardiary.com/feed/podcast',
    abbreviation: '500YD'
  },
  {
    url: 'https://thesecondgreatandbountifulhumanempire.com/feed/podcast',
    abbreviation: '2GAB'
  },
  {
    url: 'https://jodieintoterror.com/feed/podcast',
    abbreviation: 'JIT'
  }
]

export default async function (eleventyConfig) {
  eleventyConfig.addCollection('entiretyEpisodes', async () => {
    const allEpisodes = []
    for (const podcast of podcasts) {
      const feed = await Fetch(podcast.url, {
        duration: '0s',
        type: 'xml'
      })
      const parser = new XMLParser({ ignoreAttributes: false })
      const feedEpisodes = parser.parse(feed).rss.channel.item
      for (const episode of feedEpisodes) {
        episode['itunes:title'] = `${podcast.abbreviation}: ${episode.title}`
        if (episode['itunes:season']) {
          episode.title = `${podcast.abbreviation} S${episode['itunes:season']}E${episode['itunes:episode']}: ${episode.title}`
        } else if (episode['itunes:episode']) {
          episode.title = `${podcast.abbreviation} ${episode['itunes:episode']}: ${episode.title}`
        } else {
          episode.title = `${podcast.abbreviation}: ${episode.title}`
        }
        allEpisodes.push(episode)
      }
    }
    allEpisodes.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    return allEpisodes
  })
}
