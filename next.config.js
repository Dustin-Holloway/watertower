// module.exports = () => {
//   const rewrites = () => {
//     return [
//       {
//         source: "/:path*",
//         destination: "http://127.0.0.1:5555/:path*",
//       },
//     ];
//   };
//   return {
//     rewrites,
//   };
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:5555/api/:path*"
            : "/api/",
      },
    ];
  },
};

module.exports = nextConfig;
