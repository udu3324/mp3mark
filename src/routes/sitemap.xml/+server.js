export async function GET() {
    const domain = 'https://mp3mark.vercel.app'

    const urls = [
        `${domain}/`,
        `${domain}/docs`,
        `${domain}/docs?pg=intro`,
        `${domain}/docs?pg=import`,
        `${domain}/docs?pg=layout`,
        `${domain}/docs?pg=tracks`,
        `${domain}/docs?pg=tools`,
        `${domain}/editor`
    ]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml'
        }
    })
}