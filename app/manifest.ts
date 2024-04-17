import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Fritzel Pantzer',
    short_name: 'Fritzel Pantzer',
    description: 'Arkitektbyrå i Stockholm. Vi är dokumenterat skickliga på alla skeden från skiss till projektering och har goda referenser inom inredning, villor, flerbostadshus, offentliga byggnader och stadsplanering.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0026FF',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}