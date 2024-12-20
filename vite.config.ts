import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import {sentryVitePlugin} from '@sentry/vite-plugin';

// Assuming your environment variable is named VITE_API_URL
// and you have a .env file in your project root with VITE_API_URL defined

export default ({mode}: {mode: string}) => {
    // Load environment variables based on the current mode
    const env = loadEnv(mode, process.cwd());
    const isProduction = env.VITE_CURRENT_DOMAIN == 'https://www.oneit.gift';

    return defineConfig({
        esbuild: {
            drop: isProduction ? ['console', 'debugger'] : [],
        },
        plugins: [
            react({
                babel: {
                    presets: ['jotai/babel/preset'],
                },
            }),
            mkcert({
                certFileName: path.resolve(__dirname, './cert/localhost.pem'),
                keyFileName: path.resolve(
                    __dirname,
                    './cert/localhost-key.pem',
                ),
            }),
            sentryVitePlugin({
                org: 'clov3r',
                project: 'oneit-front',
            }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            port: 3000,
            proxy: {
                '/api': {
                    target: env.VITE_API_URL, // Use the loaded environment variable here
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    });
};
