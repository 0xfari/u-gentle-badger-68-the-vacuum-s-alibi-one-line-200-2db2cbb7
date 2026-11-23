// The Vacuum's Alibi — one deadpan excuse line, written to /output/entry.txt
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EXCUSE =
  "I did not miss the spot. My lidar logged it as a load-bearing crumb and left it for structural reasons.";
// The vacuum filed its excuse in triplicate: the crumb is load-bearing, the floor is not its problem.
// One hundred and three characters, one shrug: the machine logged it and moved on.

const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const targetFile = join(targetDir, "entry.txt");

function abort(reason: string): never {
  console.error(`error: ${reason}`);
  process.exit(1);
}

const codePoints = [...EXCUSE].length;
if (codePoints < 1 || codePoints > 200) {
  abort(`line must be 1-200 characters, got ${codePoints}`);
}
if (EXCUSE.trim().length === 0) abort("line must not be only whitespace");
if (EXCUSE.includes("\n") || EXCUSE.includes("\r")) abort("line must be a single line");
if (/[\u0000-\u001f\u007f]/.test(EXCUSE)) abort("line must not contain control characters");

mkdirSync(targetDir, { recursive: true });
// Empty the output directory's contents only — the directory itself may be a mount point.
for (const name of readdirSync(targetDir)) {
  rmSync(join(targetDir, name), { recursive: true, force: true });
}

writeFileSync(targetFile, EXCUSE + "\n", "utf8");
if (readFileSync(targetFile, "utf8") !== EXCUSE + "\n") {
  abort("entry.txt read-back mismatch");
}
