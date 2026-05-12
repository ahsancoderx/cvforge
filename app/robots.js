export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://cvstudio-six.vercel.app/sitemap.xml',
  };
}