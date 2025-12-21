const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');

const sitemap = new SitemapStream({ hostname: 'https://axiosn-oticias.vercel.app' });

sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
sitemap.write({ url: '/notificacao', changefreq: 'weekly', priority: 0.8 });
sitemap.write({ url: '/forum', changefreq: 'weekly', priority: 0.8 });
sitemap.write({ url: '/vagas', changefreq: 'weekly', priority: 0.8 });
sitemap.end();

streamToPromise(sitemap).then((data) => {
  fs.writeFileSync('./public/sitemap.xml', data.toString());
});
