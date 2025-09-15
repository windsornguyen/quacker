import withPWA from 'next-pwa';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
	experimental: {
		reactCompiler: true,
		browserDebugInfoInTerminal: true,
		devtoolSegmentExplorer: true,
	},
  reactStrictMode: true,
  ...withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
  }),
};

export default nextConfig;
