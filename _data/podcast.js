import { createPodcastData } from '../_11ty/podcastData.js'

export default async function () {
  return createPodcastData({ feedUrl: 'https://theentiretyof.flightthroughentirety.com/feed/podcast.xml' })
}
