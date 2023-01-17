import {
  Page,
  PageScreenshotOptions,
  LocatorScreenshotOptions,
  ElementHandle,
} from "@playwright/test";

export interface ArgosScreenshotOptions
  extends Omit<
    PageScreenshotOptions | LocatorScreenshotOptions,
    "encoding" | "type" | "omitBackground" | "path"
  > {
  /**
   * ElementHandle or string selector of the element to take a screenshot of.
   */
  element?: string | ElementHandle;
}

/**
 * Stabilize the UI and takes a screenshot of the application under test.
 * @example
 *    await argosScreenshot(page, "my-screenshot")
 *    await argosScreenshot(page, "my-screenshot", { fullPage: true })
 */
export function argosScreenshot(
  page: Page,
  name: string,
  options?: ArgosScreenshotOptions
): Promise<void>;
