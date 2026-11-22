#!/usr/bin/env node
// Validates every skills/<name>/SKILL.md against the Agent Skills spec
// (https://agentskills.io/specification) and checks that each skill is
// listed in .claude-plugin/marketplace.json. Zero dependencies.
//
// Usage: node scripts/validate-skills.mjs

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "..", "..");
const skillsDir = join(root, "skills");
const marketplacePath = join(root, ".claude-plugin", "marketplace.json");

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const errors = [];
const fail = (file, msg) => errors.push(`${relative(root, file)}: ${msg}`);

// Reads top-level scalar keys from YAML frontmatter. Handles plain, quoted
// and folded/literal (> or |) values, which covers everything SKILL.md needs.
function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/);
  if (!match) return null;
  const lines = match[1].split(/\r?\n/);
  const data = {};
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    let [, key, value] = m;
    if (/^[>|][+-]?$/.test(value)) {
      const block = [];
      while (i + 1 < lines.length && (/^\s+\S/.test(lines[i + 1]) || lines[i + 1].trim() === "")) {
        block.push(lines[++i].trim());
      }
      value = block.join(value.startsWith(">") ? " " : "\n").trim();
    } else if (/^(['"]).*\1$/.test(value)) {
      value = value.slice(1, -1);
    }
    data[key] = value.trim();
  }
  return data;
}

if (!existsSync(skillsDir)) {
  console.error("No skills/ directory found.");
  process.exit(1);
}

const skillNames = readdirSync(skillsDir).filter(
  (entry) => !entry.startsWith(".") && statSync(join(skillsDir, entry)).isDirectory(),
);

for (const dir of skillNames) {
  const file = join(skillsDir, dir, "SKILL.md");
  if (!existsSync(file)) {
    fail(join(skillsDir, dir), "missing SKILL.md");
    continue;
  }
  const fm = parseFrontmatter(readFileSync(file, "utf8"));
  if (!fm) {
    fail(file, "missing YAML frontmatter (--- block at the top of the file)");
    continue;
  }
  const { name, description } = fm;
  if (!name) fail(file, "frontmatter `name` is missing or empty");
  else {
    if (name !== dir) fail(file, `frontmatter name "${name}" must match folder name "${dir}"`);
    if (name.length > 64) fail(file, "name must be 64 characters or fewer");
    if (!NAME_RE.test(name)) {
      fail(file, "name must be lowercase letters, numbers and single hyphens, not starting or ending with a hyphen");
    }
  }
  if (!description) fail(file, "frontmatter `description` is missing or empty");
  else if (description.length > 1024) fail(file, "description must be 1024 characters or fewer");
}

// Every skill should be installable through the Claude Code marketplace,
// and every path the marketplace lists should exist.
if (existsSync(marketplacePath)) {
  let marketplace;
  try {
    marketplace = JSON.parse(readFileSync(marketplacePath, "utf8"));
  } catch (err) {
    fail(marketplacePath, `invalid JSON: ${err.message}`);
  }
  if (marketplace) {
    const listed = new Set();
    for (const plugin of marketplace.plugins ?? []) {
      for (const path of plugin.skills ?? []) {
        const normalised = path.replace(/^\.\//, "").replace(/\/$/, "");
        listed.add(normalised);
        if (!existsSync(join(root, normalised, "SKILL.md"))) {
          fail(marketplacePath, `plugin "${plugin.name}" lists ${path}, which has no SKILL.md`);
        }
      }
    }
    for (const dir of skillNames) {
      if (!listed.has(`skills/${dir}`)) {
        fail(marketplacePath, `skills/${dir} is not listed in any plugin`);
      }
    }
  }
}

if (errors.length) {
  console.error(`✖ ${errors.length} problem${errors.length === 1 ? "" : "s"} found:\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`✔ ${skillNames.length} skill${skillNames.length === 1 ? "" : "s"} valid: ${skillNames.join(", ")}`);
