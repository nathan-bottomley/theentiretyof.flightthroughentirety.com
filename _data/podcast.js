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
    feedUrl: 'https://theentiretyofentirety.com/feed/podcast.xml',
    siteUrl: 'https://theentiretyofentirety.com/',
    title: 'The Entirety of Entirety: A Doctor Who Podcast Collection',
    description: "The master feed of all of Flight Through Entirety's Doctor Who podcasts.",
    language: 'en',
    imageUrl: 'https://theentiretyofentirety.com/img/podcast-logo.jpg',
    category: 'TV & Film',
    subcategory: 'TV Reviews',
    author,
    copyrightNotice,
    feedLastBuildDate: new Date().toISOString(),
  }
}
