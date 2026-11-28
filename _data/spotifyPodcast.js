import { createPodcastData } from '../_11ty/podcastData.js'
import subscriptions from './subscriptions.json' with { type: 'json' }

const link = 'https://theentiretyof.flightthroughentirety.com/spotify-announcement/'

function subscriptionUrl (url) {
  return url.startsWith('/') ? `https://theentiretyof.flightthroughentirety.com${url}` : url
}

function subscriptionLinksHtml () {
  return subscriptions
    .map((subscription, index) => {
      const url = subscriptionUrl(subscription.url)
      const isLast = index === subscriptions.length - 1
      const text = isLast ? 'as a regular RSS feed' : subscription.name
      const prefix = isLast ? 'and ' : ''
      return `${prefix}<a href="${url}">${text}</a>`
    })
    .join(', ')
}

function announcementEpisode (pubDate) {
  const description = `<p>At the end of 2026, <em>The Entirety of Flight Through Entirety</em> will be disappearing from Spotify. We'll continue to be available — just everywhere <em>else</em> you get your podcasts, including ${subscriptionLinksHtml()}.</p>
<p>A short time ago, Spotify pulled roughly eighty episodes of <em>Flight Through Entirety</em> — over the short musical quotation that separates the intro from the body in each <em>FTE</em> episode, a quote usually taken from the soundtrack of whatever <em>Doctor Who</em> story we're discussing. And pisodes of <em>The Entirety of Flight Through Entirety</em> have already begun to disappear from Spotify.</p>
<p>I think this is fair use: each clip is a brief quotation from the work under analysis, it's part of something essentially transformative, and it doesn't replace the work itself in any way at all. Protecting this sort of thing is what the concept of fair use is for.</p>
<p>Of course, Spotify doesn't give a shit about any of that. It has complete control over its entire podcasting world, and it doesn't have to host <em>FTE</em> or anything else it doesn't approve of.</p>
<p>But outside of Spotify is the entire world of podcasting — built on open standards, under no one's control, and immune to the arbitrary algorithmic decisions of a single evil corporation.</p>
<p>Which is why, in the meantime, you can find us on <a href="https://theentiretyof.flightthroughentirety.com">our website, theentiretyof.flightthroughentirety.com</a>, and wherever you get your podcasts.</p>
<p>Thank you very much for listening and goodnight. We'll see you later, somewhere else.</p>`

  return {
    title: 'Farewell, Spotify',
    'itunes:title': 'Farewell, Spotify',
    link,
    guid: { '@_isPermaLink': 'true', '#text': link },
    pubDate,
    description,
    'itunes:summary': description,
    'content:encoded': description,
    enclosure: { '@_url': 'https://spotify-announcement.sfo3.cdn.digitaloceanspaces.com/FTE%20Spotify%20announcement.mp3', '@_length': '2725083', '@_type': 'audio/mp3' },
    'itunes:duration': '2:36',
    'itunes:explicit': true
  }
}

export default async function () {
  const base = await createPodcastData({
    feedUrl: 'https://theentiretyof.flightthroughentirety.com/feed/spotify/podcast.xml'
  })
  const pubDate = new Date(new Date(base.episodes[0].pubDate).getTime() + 60 * 60 * 1000).toUTCString()

  return createPodcastData({
    feedUrl: 'https://theentiretyof.flightthroughentirety.com/feed/spotify/podcast.xml',
    extraEpisodes: [announcementEpisode(pubDate)]
  })
}
