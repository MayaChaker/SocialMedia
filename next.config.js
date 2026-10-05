/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["next.js", "next.jsx"],
  env: {
    REACT_APP_CHECKOUT_URL: process.env.REACT_APP_CHECKOUT_URL || "",
    REACT_APP_CONTACT_EMAIL: process.env.REACT_APP_CONTACT_EMAIL || "care@velourabeauty.com",
  },
};

module.exports = nextConfig;
