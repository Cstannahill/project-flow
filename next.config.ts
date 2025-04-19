import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = isDev ? "'self' 'unsafe-eval'" : "'self'";

const nextConfig: NextConfig = {};

export default nextConfig;
