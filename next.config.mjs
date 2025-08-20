/** @type {import("next").NextConfig} */
const nextConfig = {
  typedRoutes: true,
  typescript: { ignoreBuildErrors: true },  // Quitar cuando cerremos tipos
  eslint: { ignoreDuringBuilds: true }      // Quitar cuando cerremos lint
};
export default nextConfig;