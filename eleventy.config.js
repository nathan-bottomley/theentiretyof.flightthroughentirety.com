import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'
import { VentoPlugin } from 'eleventy-plugin-vento'
import readableFilters from './_11ty/readableFilters.js'
import podcasts from './_data/podcasts.json' with { type: 'json' }

export default async function (eleventyConfig) {
  eleventyConfig.addFilter('podcast', (episode) => {
    const firstWord = episode.title.match(/^.+?\b/)[0]
    const podcast = podcasts.find(x => x.abbreviation === firstWord)
    return podcast
  })

  eleventyConfig.addFilter('splitOnce', (str, separator) => {
    const [first, ...rest] = str.split(separator)
    return [first, rest.join(separator)]
  })

  eleventyConfig.addFilter('at', (x, index) => {
    return x[index]
  })

  eleventyConfig.addFilter('truncate', (str, length) => {
    if (str.length <= length) return str

    let index = str.lastIndexOf(' ', length)
    if (index === -1) {
      index = length
    }
    return `${str.substring(0, index)}...`
  })

  eleventyConfig.addPlugin(eleventyImageTransformPlugin)
  eleventyConfig.addPlugin(readableFilters)
  eleventyConfig.addPlugin(VentoPlugin)
  eleventyConfig.addPassthroughCopy('img')
  eleventyConfig.addPassthroughCopy('css')
  eleventyConfig.addPassthroughCopy('font')
  eleventyConfig.addPassthroughCopy({ icons: '/' })
  eleventyConfig.addPassthroughCopy({ 'node_modules/fte-podcast-player/podcast-player.js': 'js/podcast-player.js' })
}
