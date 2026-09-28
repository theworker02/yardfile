
function readInput(fallback) {
  if (fallback != null && String(fallback).length) return String(fallback);
  if (process.stdin && process.stdin.isTTY) return "";
  try {
    const fs = require("fs");
    if (typeof fs.readFileSync === "function") {
      // Non-blocking when no piped data: use readFileSync only if fd 0 has size or isn't a TTY.
      return fs.readFileSync(0, "utf8");
    }
  } catch (_) {}
  return "";
}

function pick(obj, path) {
  return String(path || "").split(".").filter(Boolean).reduce((a, k) => (a == null ? undefined : a[k]), obj);
}
function flatten(obj, prefix = "", out = {}) {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) flatten(v, prefix ? prefix + "." + k : k, out);
  } else out[prefix || "value"] = obj;
  return out;
}
function run(argv) {
  const mode = argv[0] || "flatten";
  const raw = argv[1] || '{"a":{"b":1},"c":2}';
  const data = JSON.parse(raw);
  if (mode === "pick") return JSON.stringify(pick(data, argv[2] || "a.b"), null, 2);
  return JSON.stringify(flatten(data), null, 2);
}

module.exports = { readInput, pick, flatten, run };
