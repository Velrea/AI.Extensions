#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const scripts = path.resolve(here, "../../..", "plugins/mermaid/scripts");
const fixture = (name) => path.join(here, "fixtures", name);
const PNG_SIGNATURE = "89504e470d0a1a0a";

const cases = [
  { name: "render writes one PNG per diagram", file: fixture("two.md"), exit: 0, pngs: 2 },
  { name: "render writes each diagram as graph-n.png into a folder it is given", file: fixture("two.md"), exit: 0, pngs: 2, outFolder: "absolute" },
  { name: "render writes into a folder given relative to the working directory", file: fixture("two.md"), exit: 0, pngs: 2, outFolder: "relative" },
  { name: "render draws a block with a directive above its keyword", file: fixture("init.md"), exit: 0, pngs: 1 },
  { name: "render finds indented and tilde fences", file: fixture("fences.md"), exit: 0, pngs: 2 },
  { name: "render reports the parse error a reader would see", file: fixture("broken.md"), exit: 1, says: "Parse error", pngs: 0 },
  { name: "render reports a file holding no diagram", file: fixture("prose.md"), exit: 1, says: "holds no ```mermaid block", pngs: 0 },
  { name: "render replaces a cached Mermaid that fails its checksum", file: fixture("two.md"), exit: 0, pngs: 2, corruptCache: true },
  { name: "render draws with another release it knows", file: fixture("two.md"), exit: 0, pngs: 2, release: "12.1.0" },
  { name: "render refuses a release it has no checksum for", file: fixture("two.md"), exit: 2, release: "9.9.9", stderrSays: "releases this script can render are" },
];

const CORRUPT_BUNDLE = "window.mermaid = undefined;";

function isolatedHome(work) {
  const home = path.join(work, "home");
  const cache = path.join(home, ".mermaid-render");
  fs.mkdirSync(cache, { recursive: true });
  fs.writeFileSync(path.join(cache, "mermaid-11.17.2.min.js"), CORRUPT_BUNDLE);
  return { bundle: path.join(cache, "mermaid-11.17.2.min.js"), env: { HOME: home, USERPROFILE: home } };
}

function run(testCase) {
  const work = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "mermaid-scripts-test-")));
  try {
    const file = path.join(work, path.basename(testCase.file));
    fs.copyFileSync(testCase.file, file);
    const home = testCase.corruptCache ? isolatedHome(work) : undefined;
    const env = { ...process.env, ...home?.env };
    delete env.MERMAID_RENDER_VERSION;
    if (testCase.release) env.MERMAID_RENDER_VERSION = testCase.release;
    const outFolder = testCase.outFolder ? path.join(work, "out") : undefined;
    const outArgument = testCase.outFolder === "relative" ? "out" : outFolder;
    const args = [path.join(scripts, "render.mjs"), file, ...(outArgument ? [outArgument] : [])];
    const result = spawnSync(process.execPath, args, { encoding: "utf8", env, cwd: work });
    const failures = [];
    if (home && fs.readFileSync(home.bundle, "utf8") === CORRUPT_BUNDLE) {
      failures.push("the corrupted cached Mermaid was kept");
    }
    if (result.status !== testCase.exit) {
      failures.push(`expected exit ${testCase.exit}, got ${result.status}: ${(result.stdout + result.stderr).trim()}`);
    }
    if (testCase.says && !result.stdout.includes(testCase.says)) {
      failures.push(`expected output to say "${testCase.says}", got: ${result.stdout.trim()}`);
    }
    if (testCase.stderrSays && !result.stderr.includes(testCase.stderrSays)) {
      failures.push(`expected errors to say "${testCase.stderrSays}", got: ${result.stderr.trim()}`);
    }
    if (testCase.pngs !== undefined) {
      const pngs = result.stdout.split("\n").map((line) => line.trim()).filter((line) => line.endsWith(".png"));
      if (pngs.length !== testCase.pngs) {
        failures.push(`expected ${testCase.pngs} images named, got ${pngs.length}`);
      }
      if (outFolder && pngs.map((png) => path.basename(png)).join(",") !== ["graph-1.png", "graph-2.png"].slice(0, testCase.pngs).join(",")) {
        failures.push(`expected graph-1.png to graph-${testCase.pngs}.png, got ${pngs.map((png) => path.basename(png)).join(", ")}`);
      }
      for (const png of pngs) {
        if (!fs.existsSync(png)) {
          failures.push(`expected ${png}`);
        } else if (fs.readFileSync(png).subarray(0, 8).toString("hex") !== PNG_SIGNATURE) {
          failures.push(`${png} is not a PNG`);
        }
        if (outFolder && path.dirname(png) !== outFolder) {
          failures.push(`${png} was written outside ${outFolder}`);
        }
        if (!outFolder && path.dirname(png) === work) {
          failures.push(`${path.basename(png)} was written beside the answer`);
        }
      }
    }
    return failures;
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

let failed = 0;
for (const testCase of cases) {
  const failures = run(testCase);
  if (failures.length) {
    failed += 1;
    process.stdout.write(`FAIL ${testCase.name}\n${failures.map((failure) => `  ${failure}`).join("\n")}\n`);
  } else {
    process.stdout.write(`ok   ${testCase.name}\n`);
  }
}
process.stdout.write(`${cases.length - failed}/${cases.length} cases as expected\n`);
process.exit(failed ? 1 : 0);
