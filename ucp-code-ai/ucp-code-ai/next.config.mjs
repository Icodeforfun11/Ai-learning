/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Run `npm run lint` and `npm run typecheck` locally; deploys shouldn't fail on lint/type warnings.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};
export default nextConfig;
