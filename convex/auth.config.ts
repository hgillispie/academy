const getSiteUrl = () => {
  // Try to get the site URL from various environment variables
  const siteUrl =
    process.env.CONVEX_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL && `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`) ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    'http://localhost:3000';

  return siteUrl;
};

export default {
  providers: [
    {
      domain: getSiteUrl(),
      applicationID: 'convex',
    },
  ],
  redirects: {
    signIn: '/courses',
    signUp: '/courses',
    signOut: '/',
    error: '/auth/signin',
  },
};
