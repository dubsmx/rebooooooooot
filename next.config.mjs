/** @type {import("next").NextConfig} */
const nextConfig = {
  typedRoutes: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;