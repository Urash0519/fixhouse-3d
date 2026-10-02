import { test, expect, type Page } from "@playwright/test";
import { problems } from "../src/data/problems";
import { tutorials, nextNode } from "../src/data/tutorials";
const url = (path = "") => "./" + path;
async function start(page: Page) {
  await expect(
    page.getByRole("button", { name: "開始互動檢查" }),
  ).toBeDisabled();
  await page
    .getByRole("checkbox", { name: "我已閱讀安全提醒，先從外觀觀察開始" })
    .check();
  await page.getByRole("button", { name: "開始互動檢查" }).click();
}
async function answer(page: Page, value: "yes" | "no") {
  await page
    .getByRole("button", {
      name: value === "yes" ? "是 有，符合我的情況" : "否 沒有這個情況",
      exact: true,
    })
    .click();
}
test("home 3D, chapter selection, playback, comparison and navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url());
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "家的小問題",
  );
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.locator(".scene-part-label")).toHaveAttribute(
    "style",
    /left: [-\d.]+px/,
  );
  await page.getByRole("button", { name: "暫停動畫", exact: true }).click();
  const slider = page.getByRole("slider", { name: "動畫播放進度" });
  await slider.fill("75");
  await expect(slider).toHaveValue("75");
  await page.getByRole("button", { name: "正常運作", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "正常運作", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /03\s*止水$/, exact: false }).click();
  await expect(
    page.getByRole("button", { name: /03\s*止水皮$/, exact: false }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "聚焦選取零件" }).click();
  await page.getByRole("button", { name: "重設視角" }).click();
  await page.getByRole("button", { name: "拆解檢視" }).click();
  await expect(page.getByRole("button", { name: "拆解檢視" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await page.getByRole("button", { name: "拆解檢視" }).click();
  await page.getByRole("button", { name: "異常示意", exact: true }).click();
  await page.screenshot({
    path: "test-results/home-preview.png",
    fullPage: false,
  });
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "所有教學10", exact: true }).click();
  await expect(page.locator(".problem-card")).toHaveCount(10);
  expect(errors).toEqual([]);
});
test("search, category, empty results and saved filter", async ({ page }) => {
  await page.goto(url("problems/?category=electrical"));
  await expect(page.locator(".problem-card")).toHaveCount(3);
  await page
    .getByRole("button", { name: /所有問題\s*10/, exact: false })
    .click();
  await page.getByRole("searchbox").fill("浮球");
  await expect(page.locator(".problem-card")).toHaveCount(1);
  await page.getByRole("searchbox").fill("不存在的問題");
  await expect(
    page.getByText("沒有找到相符的問題", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "清除篩選" }).click();
  await expect(page.locator(".problem-card")).toHaveCount(10);
  await page.getByRole("checkbox", { name: /只看已留存摘要/ }).check();
  await expect(
    page.getByText("還沒有符合條件的摘要", { exact: true }),
  ).toBeVisible();
});
for (const problem of problems) {
  test(
    problem.id + ": direct static route, model and complete check",
    async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const response = await page.goto(url("problem/" + problem.id + "/"));
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        problem.title,
      );
      await expect(page.locator("canvas")).toBeVisible();
      await expect(page.locator(".scene-part-label")).toHaveAttribute(
        "style",
        /left: [-\d.]+px/,
      );
      await page.screenshot({
        path: "test-results/lesson-" + problem.id + ".png",
        fullPage: false,
      });
      await start(page);
      await answer(page, "no");
      const t = tutorials[problem.id];
      let state = "observe";
      while (t.nodes[state].kind === "question") {
        await answer(page, "no");
        state = nextNode(t, state, "no");
      }
      await expect(
        page.getByRole("heading", {
          level: 2,
          name: t.nodes[state].title,
          exact: true,
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "下載摘要" }),
      ).toBeVisible();
      await page.getByRole("button", { name: "修改上一個回答" }).click();
      await expect(
        page.getByRole("button", { name: "無法確認，先取得安全建議" }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "無法確認，先取得安全建議" })
        .click();
      await expect(
        page.getByRole("heading", { name: "保留觀察，交給專業確認" }),
      ).toBeVisible();
      expect(errors).toEqual([]);
    },
  );
}
test("hazard branch, answer revision, download and persistent summary", async ({
  page,
}) => {
  await page.goto(url("problem/toilet-running-water/"));
  await start(page);
  await answer(page, "yes");
  await expect(
    page.getByRole("heading", { name: "停止檢查，先確保安全" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "修改上一個回答" }).click();
  await answer(page, "no");
  await answer(page, "yes");
  await answer(page, "no");
  await answer(page, "yes");
  await expect(
    page.getByRole("heading", { name: "可能是止水皮密合不良" }),
  ).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "下載摘要" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("FixFlow-toilet-running-water.txt");
  const stream = await download.createReadStream();
  let text = "";
  if (stream) for await (const chunk of stream) text += chunk.toString();
  expect(text).toContain("可能是止水皮密合不良");
  expect(text).toContain("有大量湧水、污水回流，或漏水接近電器嗎？ → 否");
  expect(text).not.toContain("有大量湧水、污水回流，或漏水接近電器嗎？ → 是");
  await page.getByRole("button", { name: "留存結果", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "已將結果留存在這台裝置",
  );
  await page.goto(url("problems/"));
  await page.getByRole("checkbox", { name: /只看已留存摘要/ }).check();
  await expect(page.locator(".problem-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".completed-tag")).toHaveCount(1);
  await page.goto(url("problem/toilet-running-water/"));
  await page.getByText("查看上次留存摘要", { exact: true }).click();
  await expect(page.locator(".saved-record pre")).toContainText(
    "可能是止水皮密合不良",
  );
});
test("mobile layout, reduced motion, and keyboard controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(url());
  await expect(
    page.getByRole("button", { name: "播放動畫", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  await page.goto(url("problem/outlet-no-power/"));
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.locator(".scene-part-label")).toHaveAttribute(
    "style",
    /left: [-\d.]+px/,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("checkbox", { name: "我已閱讀安全提醒，先從外觀觀察開始" })
    .focus();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("button", { name: "開始互動檢查" }),
  ).toBeEnabled();
  await page.screenshot({
    path: "test-results/lesson-mobile.png",
    fullPage: true,
  });
});
test("WebGL unavailable still provides a complete accessible lesson", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type.includes("webgl")) return null;
      return getContext.apply(this, [type, ...args] as Parameters<
        typeof getContext
      >);
    } as typeof getContext;
  });
  await page.goto(url("problem/faucet-leak/"));
  await expect(
    page.getByText("此裝置無法啟用 3D，仍可使用下方零件導覽與完整檢查。"),
  ).toBeVisible();
  await start(page);
  await answer(page, "no");
  await answer(page, "yes");
  await expect(
    page.getByRole("heading", { name: "可能是閥芯密封異常" }),
  ).toBeVisible();
});
test("unknown paths return the branded 404 page", async ({ page }) => {
  const response = await page.goto(url("does-not-exist/"));
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "這個房間還找不到" }),
  ).toBeVisible();
});
