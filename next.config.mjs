/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/tjanster.html", destination: "/service", permanent: true },
      { source: "/kontakt.html", destination: "/contact", permanent: true },
      { source: "/service/bygg", destination: "/service/snickeri", permanent: true },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
