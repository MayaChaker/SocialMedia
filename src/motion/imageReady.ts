/**
 * Resolves when an image is decoded and ready to paint, or after `timeout` ms at the latest,
 * so a reveal never waits forever on a slow network. Resolves at once without an image.
 */
export function imageReady(image: HTMLImageElement | null, timeout = 2500): Promise<void> {
  if (!image) return Promise.resolve();
  const decoded = image.complete
    ? image.decode().catch(() => undefined)
    : new Promise<void>((resolve) => {
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener("error", () => resolve(), { once: true });
      });
  const late = new Promise<void>((resolve) => setTimeout(resolve, timeout));
  return Promise.race([decoded.then(() => undefined), late]);
}
