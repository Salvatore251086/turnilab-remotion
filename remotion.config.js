import { Config } from "@remotion/cli";

Config.setChromiumOptions({
  gl: "angle", // Evita crash sui driver grafici headless
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--headless",
  ],
});
