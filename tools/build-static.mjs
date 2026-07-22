import { cp, mkdir, rm, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDirectory = join(projectRoot, "dist");

const publicFiles = [
  "index.html",
  "quote.html",
  "404.html",
  "styles.css",
  "prototype.css",
  "script.js",
  "robots.txt",
  "sitemap.xml"
];

const publicDirectories = ["assets", "products", "materials"];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of publicFiles) {
  const source = join(projectRoot, file);
  if (await exists(source)) {
    await cp(source, join(outputDirectory, file));
  }
}

for (const directory of publicDirectories) {
  await cp(join(projectRoot, directory), join(outputDirectory, directory), { recursive: true });
}

console.log(`Static site built at ${outputDirectory}`);
