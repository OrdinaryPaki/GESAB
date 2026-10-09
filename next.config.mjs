/** @type {import('next').NextConfig} */
// Hardening headers that do not restrict which scripts, images or map tiles may load,
// so analytics, Google Ads and the contact map keep working unchanged.
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig = {
  devIndicators: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/tjanster.html", destination: "/service", permanent: true },
      { source: "/kontakt.html", destination: "/contact", permanent: true },
      { source: "/galleri.html", destination: "/galleri", permanent: true },
      { source: "/om_oss.html", destination: "/about", permanent: true },
      { source: "/service/bygg", destination: "/service/snickeri", permanent: true },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
