import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    build: {
        // Enable code splitting
        rollupOptions: {
            output: {
                manualChunks: {
                    // Separate vendor chunks for better caching
                    'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
                    'inertia-vendor': ['@inertiajs/react', '@inertiajs/core'],
                    'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
                    'utils-vendor': ['clsx', 'tailwind-merge'],
                },
            },
        },
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
        // Enable source maps for production debugging
        sourcemap: false,
        // Minify for smaller bundles
        minify: 'esbuild',
        // Target modern browsers for smaller bundles
        target: 'esnext',
    },
    // Optimize dependencies
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            '@inertiajs/react',
            '@inertiajs/core',
            'clsx',
            'tailwind-merge',
        ],
        exclude: ['@vite/client', '@vite/env'],
    },
    test: {
        environment: 'jsdom',
        setupFiles: 'resources/js/tests/setup.ts',
        globals: true,
    },
});
