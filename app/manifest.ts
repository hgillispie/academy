import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Builder Academy',
    short_name: 'Builder Academy',
    description: 'Learn how to use Builder.io effectively',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#a97ff2',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon?size=192x192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon?size=512x512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
