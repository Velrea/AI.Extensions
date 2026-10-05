#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import os from "node:os";
import path from "node:path";
import url from "node:url";
import { spawn } from "node:child_process";

// Each release's browser bundle, hashed as npm publishes it. The default is the release GitHub renders.
const RELEASES = {
  "11.17.2": "581ed7d74bd9048d0e3a91363927d72ef22942d7722546b27f7cc29e35390eb8",
  "12.1.0": "6484afc32872a3aa16cac9a76ba1816a1ed4cc870a6593cc2e17757750f518b2",
};
const DEFAULT_RELEASE = "11.17.2";
const RELEASE_ENV_VAR = "MERMAID_RENDER_VERSION";
const BROWSER_ENV_VAR = "MERMAID_RENDER_BROWSER";
const CACHE = path.join(os.homedir(), ".mermaid-render");
const BROWSER_TIMEOUT_MS = 120000;
const VIRTUAL_TIME_BUDGET_MS = 30000;

const PAGE_WIDTH_PX = 1200;
const PAGE_PADDING_PX = 16;

const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");

function chooseRelease() {
  const release = process.env[RELEASE_ENV_VAR]?.trim() || DEFAULT_RELEASE;
  if (!RELEASES[release]) {
    throw new Error(`${RELEASE_ENV_VAR} names Mermaid ${release}; the releases this script can render are ${Object.keys(RELEASES).join(", ")}`);
  }
  return { release, hash: RELEASES[release], bundle: path.join(CACHE, `mermaid-${release}.min.js`) };
}

async function downloadBundle({ release, hash, bundle }) {
  const source = `https://cdn.jsdelivr.net/npm/mermaid@${release}/dist/mermaid.min.js`;
  const response = await fetch(source).catch((error) => {
    throw new Error(`could not download Mermaid ${release} from ${source}: ${error.cause?.message || error.message}`);
  });
  if (!response.ok) {
    throw new Error(`could not download Mermaid ${release} from ${source}: HTTP ${response.status}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (sha256(bytes) !== hash) {
    throw new Error(`the Mermaid ${release} download from ${source} does not match its pinned SHA-256`);
  }
  await fs.mkdir(CACHE, { recursive: true });
  const partial = `${bundle}.${process.pid}.partial`;
  await fs.writeFile(partial, bytes);
  await fs.rename(partial, bundle);
}

async function ensureBundle(mermaid) {
  const cached = await fs.readFile(mermaid.bundle).catch(() => null);
  if (!cached || sha256(cached) !== mermaid.hash) {
    await downloadBundle(mermaid);
  }
}

function mermaidBlocks(markdown) {
  const fence = /^([ \t]*)(`{3,}|~{3,})mermaid[ \t]*\r?\n([\s\S]*?)^\1\2[ \t]*$/gm;
  return [...markdown.matchAll(fence)].map(([, indent, , body]) => body.replace(new RegExp(`^${indent}`, "gm"), ""));
}

async function readDiagrams(file) {
  const text = await fs.readFile(file, "utf8");
  return /\.(md|markdown)$/i.test(file) ? mermaidBlocks(text) : [text];
}

function browserCandidates() {
  if (process.platform === "win32") {
    const roots = [process.env.ProgramFiles, process.env["ProgramFiles(x86)"], process.env.LOCALAPPDATA].filter(Boolean);
    const suffixes = [
      ["Microsoft", "Edge", "Application", "msedge.exe"],
      ["Google", "Chrome", "Application", "chrome.exe"],
      ["Chromium", "Application", "chrome.exe"],
    ];
    return roots.flatMap((root) => suffixes.map((suffix) => path.join(root, ...suffix)));
  }
  if (process.platform === "darwin") {
    return [
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ];
  }
  return [
    "/opt/microsoft/msedge/msedge", "/opt/google/chrome/chrome", "/usr/bin/microsoft-edge",
    "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium",
    "/usr/bin/chromium-browser", "/snap/bin/chromium",
  ];
}

function isExecutableFile(candidate) {
  try {
    fsSync.accessSync(candidate, fsSync.constants.X_OK);
    return fsSync.statSync(candidate).isFile();
  } catch {
    return false;
  }
}

function searchPathFor(names) {
  const entries = (process.env.PATH || "").split(path.delimiter).filter(Boolean);
  return entries.flatMap((entry) => names.map((name) => path.join(entry, name)));
}

function discoverBrowser() {
  const override = process.env[BROWSER_ENV_VAR]?.trim();
  if (override) {
    const isPath = override.includes("/") || override.includes(path.sep);
    const names = process.platform === "win32" && !path.extname(override) ? [`${override}.exe`, override] : [override];
    const resolved = isPath ? [path.resolve(override)].find(isExecutableFile) : searchPathFor(names).find(isExecutableFile);
    if (!resolved) {
      throw new Error(`${BROWSER_ENV_VAR} names "${override}", which is not ${isPath ? "an executable file" : "a command on PATH"}`);
    }
    return resolved;
  }
  const onPath = process.platform === "win32"
    ? searchPathFor(["msedge.exe", "chrome.exe"])
    : searchPathFor(["microsoft-edge", "google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]);
  const found = [...browserCandidates(), ...onPath].find(isExecutableFile);
  if (!found) {
    throw new Error(
      "no Chromium-based browser found. Rendering runs Mermaid in one. "
      + `Install Edge, Chrome, or Chromium, or set ${BROWSER_ENV_VAR} to the browser executable.`,
    );
  }
  return found;
}

function runBrowser(browser, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(browser, args);
    const stdout = [];
    const stderr = [];
    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`${path.basename(browser)} did not finish within ${BROWSER_TIMEOUT_MS}ms`));
    }, BROWSER_TIMEOUT_MS);
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(new Error(`could not launch ${browser}: ${error.message}`));
    });
    child.on("close", (status) => {
      clearTimeout(timer);
      resolve({ status, stdout: Buffer.concat(stdout).toString("utf8"), stderr: Buffer.concat(stderr).toString("utf8") });
    });
  });
}

const pageStyle = `body { margin: 0; background: #fff; }
#reader { width: ${PAGE_WIDTH_PX}px; padding: ${PAGE_PADDING_PX}px; box-sizing: border-box; }
#reader svg { max-width: 100%; height: auto; }`;

function renderPage(bundle, blocks) {
  const payload = Buffer.from(JSON.stringify(blocks), "utf8").toString("base64");
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>${pageStyle}</style>
<script src="${url.pathToFileURL(bundle).href}"></script>
</head><body><div id="reader"></div><pre id="result"></pre>
<script>
(async () => {
  const bytes = Uint8Array.from(atob("${payload}"), (c) => c.charCodeAt(0));
  const blocks = JSON.parse(new TextDecoder().decode(bytes));
  const reader = document.getElementById("reader");
  const results = [];
  window.mermaid.initialize({ startOnLoad: false, suppressErrorRendering: true });
  for (const [index, source] of blocks.entries()) {
    try {
      const { svg } = await window.mermaid.render("diagram" + index, source);
      reader.innerHTML = svg;
      const element = reader.querySelector("svg");
      const shown = element.getBoundingClientRect();
      const natural = element.viewBox.baseVal;
      results.push({ ok: true, svg, shownHeightPx: Math.ceil(shown.height), scale: natural && natural.width ? shown.width / natural.width : 1 });
    } catch (error) {
      results.push({ ok: false, error: String((error && error.message) || error) });
    }
  }
  reader.innerHTML = "";
  const encoded = new TextEncoder().encode(JSON.stringify(results));
  document.getElementById("result").textContent = btoa(Array.from(encoded, (b) => String.fromCharCode(b)).join(""));
})();
</script></body></html>`;
}

function shotPage(svg) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${pageStyle}</style></head>
<body><div id="reader">${svg}</div></body></html>`;
}

const stderrTail = (run) => run.stderr.trim().split("\n").slice(-3).join(" ");

const QUIET_FLAGS = [
  "--headless", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-default-browser-check",
  "--disable-extensions", "--disable-component-update", "--disable-background-networking",
];

async function renderDiagrams(blocks, pngPaths) {
  const mermaid = chooseRelease();
  const browser = discoverBrowser();
  await ensureBundle(mermaid);
  const work = await fs.mkdtemp(path.join(os.tmpdir(), "mermaid-render-"));
  const flags = (profile) => [...QUIET_FLAGS, `--user-data-dir=${path.join(work, profile)}`];
  try {
    const page = path.join(work, "render.html");
    await fs.writeFile(page, renderPage(mermaid.bundle, blocks), "utf8");
    const run = await runBrowser(browser, [
      ...flags("render"), `--window-size=${PAGE_WIDTH_PX},${PAGE_WIDTH_PX}`, `--virtual-time-budget=${VIRTUAL_TIME_BUDGET_MS}`,
      "--dump-dom", url.pathToFileURL(page).href,
    ]);
    const match = run.stdout.match(/<pre id="result">([A-Za-z0-9+/=]+)<\/pre>/);
    if (run.status !== 0 || !match) {
      throw new Error(`the browser did not finish rendering: ${stderrTail(run)}`);
    }
    const results = JSON.parse(Buffer.from(match[1], "base64").toString("utf8"));
    await Promise.all(results.map(async (result, index) => {
      await fs.rm(pngPaths[index], { force: true });
      if (!result.ok) return;
      const page = path.join(work, `shot-${index}.html`);
      await fs.writeFile(page, shotPage(result.svg), "utf8");
      const height = result.shownHeightPx + 2 * PAGE_PADDING_PX;
      const run = await runBrowser(browser, [
        ...flags(`shot-${index}`), `--window-size=${PAGE_WIDTH_PX},${height}`, `--screenshot=${pngPaths[index]}`,
        url.pathToFileURL(page).href,
      ]);
      if (run.status !== 0) {
        throw new Error(`the browser could not take the image: ${stderrTail(run)}`);
      }
      if (!fsSync.existsSync(pngPaths[index])) {
        throw new Error(`the browser reported success but wrote no image at ${pngPaths[index]}`);
      }
    }));
    return results;
  } finally {
    await fs.rm(work, { recursive: true, force: true }).catch(() => {});
  }
}

function tempPngPaths(file, blocks) {
  const key = crypto.createHash("sha256").update(path.resolve(file)).digest("hex").slice(0, 12);
  const base = path.join(os.tmpdir(), "mermaid-render", key, path.basename(file).replace(/\.[^.]+$/, ""));
  return blocks.map((_, index) => `${base}.d${index + 1}.png`);
}

async function main() {
  const [file, outFolder] = process.argv.slice(2);
  if (!file || process.argv.length > 4) {
    process.stderr.write("usage: render.mjs <answer.md | diagram.mmd> [output-folder]\n");
    return 2;
  }
  const blocks = await readDiagrams(file);
  if (!blocks.length) {
    process.stdout.write("error: the file holds no ```mermaid block\n");
    return 1;
  }
  const pngPaths = outFolder
    ? blocks.map((_, index) => path.resolve(outFolder, `graph-${index + 1}.png`))
    : tempPngPaths(file, blocks);
  await fs.mkdir(path.dirname(pngPaths[0]), { recursive: true });
  const results = await renderDiagrams(blocks, pngPaths);
  let failed = false;
  for (const [index, result] of results.entries()) {
    if (result.ok) {
      process.stdout.write(`${pngPaths[index]}\n`);
      if (result.scale < 0.95) {
        process.stdout.write(`  diagram ${index + 1} shrank to ${Math.round(result.scale * 100)}% to fit the page\n`);
      }
    } else {
      failed = true;
      process.stdout.write(`error in diagram ${index + 1}: ${result.error}\n`);
    }
  }
  return failed ? 1 : 0;
}

main().then((code) => process.exit(code)).catch((error) => {
  process.stderr.write(`render failed: ${error.message}\n`);
  process.exit(2);
});
