import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, isAbsolute, parse, relative, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const extensionRoot = resolve(scriptDir, "..");
const repoRoot = resolve(extensionRoot, "../..");

function fail(message) {
  console.error(`Glotterfly extension: ${message}`);
  process.exit(2);
}

function isSameOrAncestor(ancestor, target) {
  const rel = relative(ancestor, target);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

function assertSafeOutputDir(outputDir) {
  const filesystemRoot = parse(outputDir).root;
  const home = resolve(homedir());

  if (outputDir === filesystemRoot) {
    fail(`refusing dangerous output directory: ${outputDir}`);
  }

  if (outputDir === home) {
    fail(`refusing to use the home directory as build output: ${outputDir}`);
  }

  // WXT may clean its output before writing. Do not allow a path that is
  // the repository/extension tree or one of their ancestors.
  if (isSameOrAncestor(outputDir, extensionRoot)) {
    fail(`refusing output directory containing the extension source tree: ${outputDir}`);
  }

  const protectedSourceDirs = [
    "entrypoints",
    "public",
    "assets",
    "components",
    "composables",
    "utils",
    "scripts",
  ].map((dir) => resolve(extensionRoot, dir));

  for (const protectedDir of protectedSourceDirs) {
    if (isSameOrAncestor(protectedDir, outputDir)) {
      fail(`refusing output directory inside source tree: ${outputDir}`);
    }
  }
}

const [operation, ...rawArgs] = process.argv.slice(2);

if (operation !== "dev" && operation !== "build") {
  fail(`expected "dev" or "build", got ${JSON.stringify(operation)}`);
}

let cliOutDir;
const forwardedArgs = [];

for (let index = 0; index < rawArgs.length; index += 1) {
  const arg = rawArgs[index];

  if (arg === "--") {
    continue;
  }

  if (arg === "--out-dir") {
    if (cliOutDir !== undefined) {
      fail("--out-dir may only be specified once");
    }

    const value = rawArgs[index + 1];

    if (value === undefined || value === "--" || value.startsWith("--")) {
      fail("--out-dir requires a directory");
    }

    cliOutDir = value;
    index += 1;
    continue;
  }

  if (arg.startsWith("--out-dir=")) {
    if (cliOutDir !== undefined) {
      fail("--out-dir may only be specified once");
    }

    cliOutDir = arg.slice("--out-dir=".length);

    if (!cliOutDir) {
      fail("--out-dir requires a directory");
    }

    continue;
  }

  forwardedArgs.push(arg);
}

const requestedOutDir = cliOutDir ?? process.env.GLOTTERFLY_OUT_DIR;
const env = { ...process.env };

if (requestedOutDir !== undefined) {
  const trimmed = requestedOutDir.trim();

  if (!trimmed) {
    fail("output directory may not be empty");
  }

  const outputDir = resolve(repoRoot, trimmed);
  assertSafeOutputDir(outputDir);
  env.GLOTTERFLY_OUT_DIR = outputDir;
}

const wxtCli = resolve(extensionRoot, "node_modules/wxt/bin/wxt.mjs");

if (!existsSync(wxtCli)) {
  fail(`WXT CLI not found at ${wxtCli}; run pnpm install first`);
}

const wxtArgs =
  operation === "build" ? [wxtCli, "build", ...forwardedArgs] : [wxtCli, ...forwardedArgs];

const child = spawn(process.execPath, wxtArgs, {
  cwd: extensionRoot,
  env,
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    if (!child.killed) {
      child.kill(signal);
    }
  });
}

child.once("error", (error) => {
  console.error(`Glotterfly extension: failed to start WXT: ${error.message}`);
  process.exit(1);
});

child.once("exit", (code, signal) => {
  // Ctrl+C is the normal way to stop the development server.
  if (operation === "dev" && signal === "SIGINT") {
    process.exit(0);
  }

  if (signal === "SIGINT") {
    process.exit(130);
  }

  if (signal === "SIGTERM") {
    process.exit(143);
  }

  process.exit(code ?? 1);
});
