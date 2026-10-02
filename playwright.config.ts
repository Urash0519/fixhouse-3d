import { defineConfig, devices } from "@playwright/test";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/fixhouse-3d";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  expect: { timeout: 10000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3000" + basePath + "/",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: {
      args: [
        "--use-gl=angle",
        "--use-angle=swiftshader",
        "--enable-unsafe-swiftshader",
      ],
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
  ],
  webServer: {
    command: "npm run preview",
    url: "http://127.0.0.1:3000" + basePath + "/",
    reuseExistingServer: !process.env.CI,
    env: { NEXT_PUBLIC_BASE_PATH: basePath },
    timeout: 30000,
  },
});
