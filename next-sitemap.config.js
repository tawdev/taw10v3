module.exports = {
  siteUrl: 'https://taw10.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: 'public',
  additionalPaths: async (config) => [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/blog', changefreq: 'weekly', priority: 0.9 },
    { loc: '/services/domiciliation', changefreq: 'monthly', priority: 0.8 },
    { loc: '/services/creation-entreprise', changefreq: 'monthly', priority: 0.8 },
    { loc: '/services/secretariat', changefreq: 'monthly', priority: 0.8 },
    { loc: '/services/accompagnement-juridique', changefreq: 'monthly', priority: 0.8 },
    { loc: '/services/support-administratif', changefreq: 'monthly', priority: 0.8 },
    { loc: '/services/conseil-strategique', changefreq: 'monthly', priority: 0.8 },
  ]
}
