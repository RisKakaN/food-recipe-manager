/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        domains: [
            "lh3.googleusercontent.com",
            "firebasestorage.googleapis.com",
        ],
    },
    modularizeImports: {
        "@heroicons/react/24/outline": {
            transform: "@heroicons/react/24/outline/{{member}}",
        },
        "@heroicons/react/24/solid": {
            transform: "@heroicons/react/24/solid/{{member}}",
        },
        "flowbite-react": {
            transform:
                "flowbite-react/lib/esm/components/{{member}}/{{member}}",
            skipDefaultConversion: true,
        },
    },
};

module.exports = nextConfig;
