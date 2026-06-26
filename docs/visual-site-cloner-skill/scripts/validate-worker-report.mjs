#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { cwd, exit } from "node:process";

const allowedStatuses = new Set([
  "ready_for_main_review",
  "blocked",
  "needs_foundation_decision",
  "repair_complete",
]);

const allowedTags = new Set([
  "worker_report",
  "mission_id",
  "status",
  "foundation_version_used",
  "worktree",
  "reference",
  "url",
  "desktop_screenshot",
  "mobile_screenshot",
  "local",
  "route",
  "changed_files",
  "file",
  "qa_summary",
  "desktop_passes",
  "mobile_passes",
  "sections_checked",
  "p0_unresolved",
  "p1_unresolved",
  "p2_remaining",
  "global_files_touched",
  "foundation_change_request_submitted",
  "foundation_change_requests",
  "foundation_change_request",
  "remaining_deviations",
  "deviation",
  "ready",
]);

const globalFilePatterns = [
  /(^|\/)globals\.(css|scss|sass|less)$/,
  /(^|\/)layout\.(js|jsx|ts|tsx)$/,
  /(^|\/)Header\.(js|jsx|ts|tsx)$/,
  /(^|\/)Footer\.(js|jsx|ts|tsx)$/,
  /(^|\/)PageShell\.(js|jsx|ts|tsx)$/,
  /(^|\/)(tokens|theme|design-tokens)\.(js|jsx|ts|tsx|css|json)$/,
  /(^|\/)(animations|motion)\.(js|jsx|ts|tsx|css)$/,
];

function usage() {
  console.error(
    "Usage: node validate-worker-report.mjs <report.xml> [--foundation-version <version>] [--base-dir <dir>] [--allow-global-changes]",
  );
}

function argValue(args, name) {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
}

function text(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? match[1].trim() : "";
}

function texts(xml, tag) {
  return [...xml.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "gi"))].map((m) =>
    m[1].trim(),
  );
}

function boolText(value) {
  return value.trim().toLowerCase() === "true";
}

function numberText(value) {
  if (!/^-?\d+$/.test(value.trim())) return Number.NaN;
  return Number(value.trim());
}

function reportPath(baseDir, value) {
  if (!value) return "";
  return isAbsolute(value) ? value : resolve(baseDir, value);
}

function isGlobalFile(path) {
  return globalFilePatterns.some((pattern) => pattern.test(path));
}

const args = process.argv.slice(2);
const reportFile = args[0];
if (!reportFile || reportFile.startsWith("--")) {
  usage();
  exit(2);
}

const expectedFoundation = argValue(args, "--foundation-version");
const baseDir = resolve(argValue(args, "--base-dir") ?? cwd());
const allowGlobalChanges = args.includes("--allow-global-changes");

const errors = [];
const warnings = [];

if (!existsSync(reportFile)) {
  console.error(JSON.stringify({ valid: false, errors: [`Report file not found: ${reportFile}`] }, null, 2));
  exit(1);
}

const xml = readFileSync(reportFile, "utf8");
const tagNames = [...xml.matchAll(/<\/?([a-zA-Z_][\w:-]*)\b/g)]
  .map((m) => m[1].replace(/^\/+/, ""))
  .filter((name) => !name.includes(":"));

for (const tag of tagNames) {
  if (!allowedTags.has(tag)) errors.push(`Disallowed XML tag: ${tag}`);
}

const missionId = text(xml, "mission_id");
const status = text(xml, "status");
const foundation = text(xml, "foundation_version_used");
const desktopScreenshots = texts(xml, "desktop_screenshot");
const mobileScreenshots = texts(xml, "mobile_screenshot");
const changedFiles = texts(xml, "file");
const p0 = numberText(text(xml, "p0_unresolved"));
const p1 = numberText(text(xml, "p1_unresolved"));
const globalFilesTouched = boolText(text(xml, "global_files_touched"));
const requestSubmitted = boolText(text(xml, "foundation_change_request_submitted"));

if (!missionId) errors.push("Missing mission_id");
if (!status) errors.push("Missing status");
if (status && !allowedStatuses.has(status)) errors.push(`Invalid status: ${status}`);
if (!foundation) errors.push("Missing foundation_version_used");
if (expectedFoundation && foundation && foundation !== expectedFoundation) {
  errors.push(`foundation_version_used ${foundation} does not match expected ${expectedFoundation}`);
}

if (!desktopScreenshots.length) errors.push("Missing desktop_screenshot");
if (!mobileScreenshots.length) errors.push("Missing mobile_screenshot");

for (const shot of [...desktopScreenshots, ...mobileScreenshots]) {
  if (!existsSync(reportPath(baseDir, shot))) errors.push(`Screenshot file not found: ${shot}`);
}

if (Number.isNaN(p0)) errors.push("Missing or invalid p0_unresolved");
if (Number.isNaN(p1)) errors.push("Missing or invalid p1_unresolved");
if (!Number.isNaN(p0) && p0 !== 0) errors.push(`p0_unresolved must be 0, got ${p0}`);
if (!Number.isNaN(p1) && p1 !== 0) errors.push(`p1_unresolved must be 0, got ${p1}`);

const globalChangedFiles = changedFiles.filter(isGlobalFile);
if (globalChangedFiles.length && !globalFilesTouched) {
  errors.push(`global_files_touched is false, but changed_files includes global files: ${globalChangedFiles.join(", ")}`);
}

if ((globalFilesTouched || globalChangedFiles.length) && !requestSubmitted && !allowGlobalChanges) {
  errors.push("Global files were touched without foundation_change_request_submitted=true");
}

if (status === "ready_for_main_review" && (!desktopScreenshots.length || !mobileScreenshots.length)) {
  errors.push("ready_for_main_review requires desktop and mobile screenshot evidence");
}

if (!changedFiles.length) warnings.push("No changed_files listed");

const result = {
  valid: errors.length === 0,
  mission_id: missionId || null,
  status: status || null,
  foundation_version_used: foundation || null,
  errors,
  warnings,
};

console.log(JSON.stringify(result, null, 2));
exit(result.valid ? 0 : 1);
