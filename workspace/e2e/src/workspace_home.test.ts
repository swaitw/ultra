import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import {
  assertEquals,
  fail,
} from "https://deno.land/std@0.130.0/testing/asserts.ts";

Deno.test("Should render home page of workspace example app with expected text", async () => {
  const expectations = [
    { text: "ULTRA", selector: "h1" },
    { text: "component.jsx", selector: "h2" },
  ];

  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 979, height: 865 });
  await page.goto("http://localhost:8000/");

  try {
    for (const expected of expectations) {
      const selection = await page.waitForSelector(expected.selector);
      if (selection) {
        const text = await page.evaluate(
          (element) => element.textContent,
          selection,
        );
        assertEquals(text, expected.text);
      } else {
        fail(`ERROR: Selector ${expected.selector} not found`);
      }
    }
  } catch (e) {
    fail(`ERROR: ${e}`);
  } finally {
    await browser.close();
  }
});
