import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    // The previous HTML portfolio served these exact asset URLs. Keeping them
    // alive preserves any indexed image references after the Next.js migration.
    return [
      { source: "/me.png", destination: "/assets/me.png", permanent: true },
      { source: "/site.webmanifest", destination: "/manifest.webmanifest", permanent: true },
      { source: "/apple-touch-icon.png", destination: "/apple-icon.png", permanent: true },
      { source: "/icon-192.png", destination: "/icons/icon-192.png", permanent: true },
      { source: "/icon-512.png", destination: "/icons/icon-512.png", permanent: true },
      { source: "/favicon-16x16.png", destination: "/icons/favicon-16x16.png", permanent: true },
      { source: "/favicon-32x32.png", destination: "/icons/favicon-32x32.png", permanent: true },
      { source: "/favicon-48x48.png", destination: "/icons/favicon-48x48.png", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // The resume stays downloadable, but it should not appear in search
        // results: the PDF contains a phone number and home address that the
        // README states are intentionally not published.
        source: "/Al_Shahriar_Sowan_Resume.pdf",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;
