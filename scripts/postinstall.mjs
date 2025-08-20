import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdir, copyFile } from "node:fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = resolve(__dirname, "../node_modules/pdfjs-dist/legacy/build/pdf.worker.min.js");
const destDir = resolve(__dirname, "../public");
const dest = resolve(destDir, "pdf.worker.min.js");
await mkdir(destDir, { recursive: true });
try {
  await copyFile(src, dest);
  console.log("[postinstall] Copied pdf.worker.min.js -> /public");
} catch (e) {
  console.warn("[postinstall] Could not copy pdf.worker.min.js", e?.message || e);
}