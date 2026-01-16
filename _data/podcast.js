const author = 'Flight Through Entirety'

const startYear = 2026
const currentYear = new Date().getFullYear()
let copyrightNotice
if (startYear === currentYear) {
  copyrightNotice = `© ${startYear} ${author}`
} else {
  copyrightNotice = `© ${startYear}–${currentYear} ${author}`
}

export default function () {
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
    }
  }
}
