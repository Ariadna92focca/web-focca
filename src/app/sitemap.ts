import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://focca.es'

    const routes = [
        '',
        '/quienes-somos',
        '/junta-directiva',
        '/asociaciones',
        '/normativa',
        '/contacto',
        '/concursos',
        '/noticias',
        '/impresos',
        '/galeria',
        '/enlaces',
        '/liga-sansofe',
        '/aviso-legal',
        '/privacidad',
        '/cookies',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route === '/noticias' || route === '/asociaciones' ? 0.8 : 0.5,
    }))
}
