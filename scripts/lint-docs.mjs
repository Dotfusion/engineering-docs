#!/usr/bin/env node
/**
 * Enforces the mechanical rules from ai/AGENTS.md, plus internal link
 * integrity. Rules that need human judgement (title case, active voice,
 * paragraph length) stay on the pull request checklist.
 *
 * Usage:
 *   node scripts/lint-docs.mjs            check every handbook document
 *   node scripts/lint-docs.mjs path.md    check specific files
 *
 * Escape hatches:
 *   <!-- lint-ignore -->                  at the end of a line, skips that line
 *   <!-- lint-disable: rule, rule -->     anywhere in a file, skips those rules
 */

import { readFileSync, existsSync, statSync } from "node:fs";
import { readdirSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "node_modules", "ai/skills"]);

// Indexes, logs, and templates are not standards, so they carry no Related section.
const NO_RELATED = new Set([
  "README.md",
  "SUMMARY.md",
  "CHANGELOG.md",
  "assets/README.md",
  ".github/pull_request_template.md",
]);

const RULES = [
  {
    id: "em-dash",
    test: (line) => line.includes("—"),
    message: "em dash; use a colon, comma, period, or rephrase",
  },
  {
    id: "curly-quotes",
    test: (line) => /[‘’“”]/.test(line),
    message: "curly quote; use a straight quote",
  },
  {
    id: "ellipsis-char",
    test: (line) => line.includes("…"),
    message: "ellipsis character; write three periods or rephrase",
  },
  {
    id: "banned-words",
    test: (line) => /\b(easy|easily|simple|simply|quick|quickly|very|just|really)\b/i.test(line),
    message: 'banned word ("easy", "simple", "quick", "very", "just", "really"); describe the action concretely',
  },
  {
    id: "british-spelling",
    test: (line) =>
      /\b(standardis(e[ds]?|ing)|organis(e[ds]?|ation[s]?|ing)|honour[s]?|behaviour[s]?|colour[s]?|neighbour(s|ing|hood)?|licence[sd]?|analys(e[ds]?|ing)|prioritis(e[ds]?|ing)|recognis(e[ds]?|ing)|judgement[s]?|centre[sd]?|defence|offence|labour|favour(ite)?[s]?|programme[s]?|catalogue[sd]?|fulfilment|travelled|cancelled|modelling|labelled|whilst|amongst|towards)\b/i.test(line),
    message: "British spelling; this handbook uses American spelling",
  },
  {
    id: "hard-wrap",
    test: (line) => /\S {2,}$/.test(line),
    message: "trailing spaces used as a line break; put the paragraph on one line",
  },
  {
    id: "banned-phrase",
    test: (line) => /\b(in order to|utili[sz]e[ds]?|leverage[ds]?|seamless(ly)?|empower(s|ed)?|best-in-class|cutting-edge|game-chang(er|ing))\b/i.test(line),
    message: "marketing or padded wording; state the action plainly",
  },
  {
    id: "bare-link-text",
    test: (line) => /\[(here|link|this|click here|read more)\]\(/i.test(line),
    message: "anchor text does not name its destination",
  },
  {
    id: "bare-url",
    test: (line) => /(^|[\s(])https?:\/\/\S+/.test(line) && !/\]\(/.test(line) && !/^\s*[-*]?\s*`/.test(line),
    message: "bare URL; use markdown link syntax with descriptive anchor text",
  },
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = relative(ROOT, full);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || SKIP_DIRS.has(rel)) continue;
      walk(full, out);
    } else if (entry.name.endsWith(".md")) {
      out.push(rel);
    }
  }
  return out;
}

function checkAnchor(targetPath, anchor) {
  const body = readFileSync(targetPath, "utf8");
  const slugs = new Set();
  for (const line of body.split("\n")) {
    const m = /^#{1,6}\s+(.*)$/.exec(line);
    if (!m) continue;
    slugs.add(
      m[1]
        .replace(/`/g, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
    );
  }
  return slugs.has(anchor.toLowerCase());
}

const findings = [];

function lintFile(file) {
  const abs = resolve(ROOT, file);
  const text = readFileSync(abs, "utf8");
  const lines = text.split("\n");

  const disabled = new Set();
  const disableMatch = text.match(/<!--\s*lint-disable:\s*([^>]+?)\s*-->/);
  if (disableMatch) {
    for (const id of disableMatch[1].split(",")) disabled.add(id.trim());
  }

  let inFence = false;
  let inFrontmatter = false;

  lines.forEach((line, index) => {
    const lineNo = index + 1;
    const report = (id, message) => {
      if (disabled.has(id)) return;
      findings.push(`${file}:${lineNo} - ${message}`);
    };

    if (lineNo === 1 && line.trim() === "---") {
      inFrontmatter = true;
      return;
    }
    if (inFrontmatter) {
      if (line.trim() === "---") inFrontmatter = false;
      return;
    }

    if (line.startsWith("```")) {
      if (!inFence) {
        inFence = true;
        if (line.trim() === "```") report("fence-language", "opening code fence has no language tag");
      } else {
        inFence = false;
      }
      return;
    }

    if (line.includes("<!-- lint-ignore -->")) return;

    if (line.trim() === "---" || line.trim() === "***" || line.trim() === "___") {
      report("horizontal-rule", "horizontal rule between sections; use a heading instead");
      return;
    }

    if (inFence) return;

    for (const rule of RULES) {
      if (rule.test(line)) report(rule.id, rule.message);
    }

    // Internal link integrity.
    const linkRe = /\[[^\]]*\]\(([^)\s]+)\)/g;
    let m;
    while ((m = linkRe.exec(line)) !== null) {
      const href = m[1];
      if (/^(https?:|mailto:|#)/.test(href)) continue;
      const [pathPart, anchor] = href.split("#");
      if (!pathPart) continue;
      const target = resolve(dirname(abs), pathPart);
      if (!existsSync(target)) {
        report("broken-link", `link target does not exist: ${href}`);
        continue;
      }
      if (anchor && statSync(target).isFile() && target.endsWith(".md")) {
        if (!checkAnchor(target, anchor)) {
          report("broken-anchor", `link anchor not found in target: ${href}`);
        }
      }
    }

    if (inFence === false && line.startsWith("#")) {
      const m2 = /^(#{1,6})\s*$/.exec(line);
      if (m2) report("empty-heading", "heading has no text");
    }
  });

  if (inFence) findings.push(`${file}:${lines.length} - unclosed code fence`);

  // Hard-wrapped prose: a prose line ending mid-sentence with prose after it.
  if (!disabled.has("hard-wrap-paragraph")) {
    const isProse = (l) =>
      l.trim() !== "" && !/^\s*(#|[-*+]\s|\d+\.\s|\||>|```|<)/.test(l);
    let fence = false;
    let comment = false;
    let front = lines[0]?.trim() === "---";
    for (let i = 0; i < lines.length - 1; i++) {
      if (front) {
        if (i > 0 && lines[i].trim() === "---") front = false;
        continue;
      }
      if (lines[i].startsWith("```")) { fence = !fence; continue; }
      if (fence) continue;
      if (lines[i].includes("<!--") && !lines[i].includes("-->")) comment = true;
      if (comment) {
        if (lines[i].includes("-->")) comment = false;
        continue;
      }
      if (lines[i].includes("<!-- lint-ignore -->")) continue;
      if (isProse(lines[i]) && isProse(lines[i + 1]) && !/[.:;,!?)\]`"']$/.test(lines[i].trimEnd())) {
        findings.push(`${file}:${i + 1} - hard-wrapped paragraph; keep each paragraph on one line`);
      }
    }
  }

  // Every document ends with a Related section linking its neighbours.
  if (!disabled.has("related-section") && !NO_RELATED.has(file)) {
    if (!/^## Related$/m.test(text)) {
      findings.push(`${file}:${lines.length} - no "## Related" section (ai/AGENTS.md requires one)`);
    }
  }
}

const args = process.argv.slice(2);
const files = args.length ? args : walk(ROOT).sort();

for (const file of files) lintFile(file);

if (findings.length === 0) {
  console.log(`Checked ${files.length} documents. No issues.`);
  process.exit(0);
}

console.log(findings.join("\n"));
console.log(`\n${findings.length} issue(s) across ${files.length} documents.`);
process.exit(1);
