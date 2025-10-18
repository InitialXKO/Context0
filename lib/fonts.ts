import { Noto_Sans_SC } from "next/font/google";

export const sans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-sans",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "\"PingFang SC\"",
    "\"Hiragino Sans GB\"",
    "\"Microsoft YaHei\"",
    "\"Noto Sans SC\"",
    "sans-serif"
  ]
});

export const heading = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-heading",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "\"PingFang SC\"",
    "\"Hiragino Sans GB\"",
    "\"Microsoft YaHei\"",
    "\"Noto Sans SC\"",
    "sans-serif"
  ]
});
