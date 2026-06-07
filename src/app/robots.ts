import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/privado', '/privado/*'],
        },
        sitemap: 'https://focca.es/sitemap.xml',
    }
}
