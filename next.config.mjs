/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true, // App Router 활성화
    },

    images: {

        domains: ["res.cloudinary.com"],
    },
    async redirects() {
        return [
            {
                source: "/dashboard",
                has: [
                    {
                        type: "cookie",
                        key: "isAuthenticated",
                        value: "false",
                    },
                ],
                permanent: true,
                destination: "/Login",
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: "/predict",
                destination: "http://202.30.29.168:5000/predict",
            },
        ];
    },
};

export default nextConfig;
