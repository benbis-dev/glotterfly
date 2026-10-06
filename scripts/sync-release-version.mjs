import { readFile, writeFile } from "node:fs/promises";

const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
  throw new Error(`invalid release version: ${JSON.stringify(version)}`);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

const rootPackage = await readJson("package.json");
const extensionPackage = await readJson("apps/extension/package.json");

rootPackage.version = version;
extensionPackage.version = version;

await Promise.all([
  writeJson("package.json", rootPackage),
  writeJson("apps/extension/package.json", extensionPackage),
]);
