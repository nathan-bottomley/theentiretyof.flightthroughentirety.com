import Fetch from '@11ty/eleventy-fetch';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'
import { VentoPlugin } from 'eleventy-plugin-vento';
import { XMLParser } from 'fast-xml-parser';
import podcasts from './_data/podcasts.json' with { type: 'json' };

export default async function (eleventyConfig) {
  eleventyConfig.addCollection('episode', async () => {
    const allEpisodes = []
    for (const podcast of podcasts) {
      const feed = await Fetch(podcast.feedUrl, {
        duration: '1d',
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

  eleventyConfig.addFilter('readableDate', (date) => {
    return new Date(date).toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' })
  })

  eleventyConfig.addFilter('podcast', (episode) => {
    const firstWord = episode.title.match(/^.+?\b/)[0]
    const podcast = podcasts.find(x => x.abbreviation === firstWord)
    return podcast
  })

  eleventyConfig.addFilter('splitOnce', (str, separator) => {
    const [first, ...rest] = str.split(separator)
    return [first, rest.join(separator)]
  })

  eleventyConfig.addFilter('atIndex', (arr, index) => {
    return arr[index]
  })

  eleventyConfig.addFilter('truncate', (str, length) => {
    if (str.length <= length) return str

    let index = str.lastIndexOf(' ', length)
    if (index === -1) {
      index = length;
    }
    return `${str.substring(0, index)}...`
  })

  eleventyConfig.addPlugin(eleventyImageTransformPlugin)
  eleventyConfig.addPlugin(VentoPlugin)
  eleventyConfig.addPassthroughCopy('img')
  eleventyConfig.addPassthroughCopy('css')
  eleventyConfig.addPassthroughCopy('font')
  eleventyConfig.addPassthroughCopy({ 'icons': '/' })
}
