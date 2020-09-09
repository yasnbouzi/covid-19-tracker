const withCSS = require('@zeit/next-css');
const withOffline = require('next-offline');

const runtimeCaching = [
    {
        urlPattern: '/',
        handler: 'NetworkFirst',
        options: {
            cacheName: 'start-url',
            expiration: {
                maxEntries: 1,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
            },
        },
    },
    {
        urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
            cacheName: 'google-fonts',
            expiration: {
                maxEntries: 4,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
            },
        },
    },
    {
        urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
        handler: 'CacheFirst',
        options: {
            cacheName: 'font-assets',
            expiration: {
                maxEntries: 4,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
            },
        },
    },
    {
        urlPattern: new RegExp(/https:\/\/disease.sh\/assets/),
        handler: 'CacheFirst',
        options: {
            cacheName: 'image-assets',
            expiration: {
                maxEntries: 200,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
            },
        },
    },
    {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: 'CacheFirst',
        options: {
            cacheName: 'image-assets',
            expiration: {
                maxEntries: 64,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
            },
        },
    },
    {
        urlPattern: /\.(?:js)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
            cacheName: 'js-assets',
            expiration: {
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
            },
        },
    },
    {
        urlPattern: /\.(?:css|less)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
            cacheName: 'style-assets',
            expiration: {
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
            },
        },
    },
    {
        urlPattern: /\.(?:json|xml|csv)$/i,
        handler: 'NetworkFirst',
        options: {
            cacheName: 'data-assets',
            expiration: {
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
            },
        },
    },
    {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
            cacheName: 'offlineCache',
            expiration: {
                maxEntries: 200,
            },
        },
    },
];
const nextConfig = {
    workboxOpts: { swDest: process.env.NEXT_EXPORT === 'true' ? 'service-worker.js' : 'static/service-worker.js', runtimeCaching },
    webpack: function (config) {
        config.module.rules.push({
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 100000,
                    name: '[name].[ext]',
                },
            },
        });
        return config;
    },
    async rewrites() {
        return [
            {
                source: '/service-worker.js',
                destination: '/_next/static/service-worker.js',
            },
        ];
    },
};
module.exports = withOffline(withCSS(nextConfig));
