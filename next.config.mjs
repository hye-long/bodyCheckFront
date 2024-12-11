/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        path: '/next/public/images',
        disableStaticImages: false,
        loader: 'default',
        minimumCacheTTL: 60,
        formats: ['image/webp'],
        dangerouslyAllowSVG: false,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        contentDispositionType: 'inline',
        remotePatterns: [],
        unoptimized: false,
        loaderFile: '',
    },
    async redirects() {
        return [
            {
                source: '/dashboard',
                has: [
                    {
                        type: 'cookie',
                        key: 'isAuthenticated',
                        value: 'false',
                    },
                ],
                permanent: true,
                destination: '/Login',
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/predict', // Next.js에서 사용하는 엔드포인트
                destination: 'http://202.30.29.168:5000/predict' // Flask 서버의 엔드포인트
            },
        ];
    },
};

export default nextConfig;
