import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const screenshotFolder = "./screenshots";

export async function goto({ page, link }) {
  await page.goto(link, { waitUntil: "networkidle" });
}

const GLOBAL_STYLES = `
  /* Hide carets */
  * { caret-color: transparent !important; }

  /* Hide scrollbars */
  ::-webkit-scrollbar {
    display: none !important;
  }

  /* Generic hide */
  [data-visual-test="transparent"] {
    color: transparent !important;
    font-family: monospace !important;
    opacity: 0 !important;
  }
  
  [data-visual-test="removed"] {
    display: none !important;
  }
`;

// Check if the fonts are loaded
function waitForFontLoading() {
  return document.fonts.status === "loaded";
}

// Check if the images are loaded
async function waitForImagesLoading() {
  return Promise.all(
    Array.from(document.images)
      .filter((img) => !img.complete)
      .map(
        (img) =>
          new Promise((resolve) => {
            img.onload = img.onerror = resolve;
          })
      )
  );
}

export async function argosScreenshot(
  page,
  name,
  { element = page, ...options } = {}
) {
  if (!page) throw new Error("A Playwright `page` object is required.");
  if (!name) throw new Error("The `name` argument is required.");

  mkdir(screenshotFolder, { recursive: true });

  const [resolvedElement] = await Promise.all([
    typeof element === "string" ? page.locator(element) : element,
    page.addStyleTag({ content: GLOBAL_STYLES }),
    page.waitForSelector('[aria-busy="true"]', { state: "hidden" }),
    page.waitForFunction(waitForImagesLoading),
    page.waitForFunction(waitForFontLoading),
  ]);

  await resolvedElement.screenshot({
    path: resolve(screenshotFolder, `${name}.png`),
    type: "png",
    fullPage: true,
    mask: [page.locator('[data-visual-test="blackout"]')],
    animations: "disabled",
    ...options,
  });
}
