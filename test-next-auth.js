const nextAuth = require("next-auth");
const nextAuthNext = require("next-auth/next");
console.log("next-auth is:", typeof nextAuth.default);
console.log("next-auth/next is:", typeof nextAuthNext.default);
