import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Native iOS shell for UCP CODE AI.
 * The app uses server-side API routes (AI streaming, auth), so the iOS app loads your
 * deployed HTTPS site rather than bundling a static export. Set CAPACITOR_SERVER_URL
 * before running `npm run ios:sync`.
 */
const config: CapacitorConfig = {
  appId: "com.universalcreativityprojects.ucpcodeai",
  appName: "UCP CODE AI",
  webDir: "public",
  ios: { contentInset: "always", backgroundColor: "#05070f" },
  server: {
    url: process.env.CAPACITOR_SERVER_URL || "https://your-app.netlify.app",
    cleartext: false,
  },
};
export default config;
