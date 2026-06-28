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
  "interaction_summary",
  "interaction_families_checked",
  "state_screenshots",
  "state",
  "p0_interaction_unresolved",
  "p1_interaction_unresolved",
  "p2_interaction_remaining",
  "section_audit_ledger",
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
    "Usage: node validate-worker-report.mjs <report.xml> [--foundation-version <version>] [--base-dir <dir>] [--interaction-map <path>] [--allow-global-changes]",
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

function attrValue(attrs, name) {
  const match = attrs.match(new RegExp(`${name}=["']([^"']+)["']`, "i"));
  return match ? match[1].trim() : "";
}

function stateScreenshots(xml) {
  return [...xml.matchAll(/<state\b([^>]*)>([\s\S]*?)<\/state>/gi)].map((match) => ({
    component: attrValue(match[1], "component") || attrValue(match[1], "family"),
    state: attrValue(match[1], "state"),
    viewport: attrValue(match[1], "viewport"),
    path: match[2].trim(),
  }));
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

function normalizeFamily(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function collectInteractionEntries(node, missionId, inheritedMission, out) {
  if (!node) return;
  if (Array.isArray(node)) {
    for (const item of node) collectInteractionEntries(item, missionId, inheritedMission, out);
    return;
  }
  if (typeof node !== "object") return;

  const currentMission =
    node.mission_id ||
    node.missionId ||
    node.mission ||
    node.assigned_mission ||
    node.assignedMission ||
    inheritedMission;

  const family =
    node.family ||
    node.interaction_family ||
    node.interactionFamily ||
    node.component ||
    node.type ||
    node.name;

  const looksInteractive = Boolean(
    family ||
      node.selector ||
      node.states ||
      node.required_states ||
      node.requiredStates ||
      node.has_interactions ||
      node.hasInteractions,
  );

  if (currentMission === missionId && looksInteractive) {
    out.push({ ...node, family: family || "interaction" });
  }

  for (const [key, value] of Object.entries(node)) {
    const nextMission = key === missionId ? missionId : currentMission;
    collectInteractionEntries(value, missionId, nextMission, out);
  }
}

function interactionsForMission(map, missionId) {
  const out = [];
  collectInteractionEntries(map, missionId, null, out);

  const seen = new Set();
  return out.filter((entry) => {
    const key = JSON.stringify(entry);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const args = process.argv.slice(2);
const reportFile = args[0];
if (!reportFile || reportFile.startsWith("--")) {
  usage();
  exit(2);
}

const expectedFoundation = argValue(args, "--foundation-version");
const baseDir = resolve(argValue(args, "--base-dir") ?? cwd());
const interactionMapFile = argValue(args, "--interaction-map");
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
const p0Interaction = numberText(text(xml, "p0_interaction_unresolved"));
const p1Interaction = numberText(text(xml, "p1_interaction_unresolved"));
const globalFilesTouched = boolText(text(xml, "global_files_touched"));
const requestSubmitted = boolText(text(xml, "foundation_change_request_submitted"));
const interactionSummary = text(xml, "interaction_summary");
const states = stateScreenshots(xml);

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

if (interactionMapFile) {
  const resolvedInteractionMap = reportPath(baseDir, interactionMapFile);
  if (!existsSync(resolvedInteractionMap)) {
    errors.push(`Interaction map not found: ${interactionMapFile}`);
  } else if (missionId) {
    let map;
    try {
      map = JSON.parse(readFileSync(resolvedInteractionMap, "utf8"));
    } catch (error) {
      errors.push(`Interaction map is not valid JSON: ${error.message}`);
    }

    if (map) {
      const interactions = interactionsForMission(map, missionId);
      if (interactions.length) {
        if (!interactionSummary) errors.push("interaction-map lists interactions for this mission, but interaction_summary is missing");
        if (!states.length) errors.push("interaction-map lists interactions for this mission, but state screenshots are missing");

        if (Number.isNaN(p0Interaction)) errors.push("Missing or invalid p0_interaction_unresolved");
        if (Number.isNaN(p1Interaction)) errors.push("Missing or invalid p1_interaction_unresolved");
        if (!Number.isNaN(p0Interaction) && p0Interaction !== 0) {
          errors.push(`p0_interaction_unresolved must be 0, got ${p0Interaction}`);
        }
        if (!Number.isNaN(p1Interaction) && p1Interaction !== 0) {
          errors.push(`p1_interaction_unresolved must be 0, got ${p1Interaction}`);
        }

        const requiredFamilies = new Set(interactions.map((entry) => normalizeFamily(entry.family)).filter(Boolean));
        if (states.length < requiredFamilies.size) {
          errors.push(
            `interaction-map lists ${requiredFamilies.size} interaction families for this mission, but report includes ${states.length} state screenshots`,
          );
        }
      }
    }
  }
}

for (const state of states) {
  if (!state.path) errors.push("State screenshot path is empty");
  if (state.path && !existsSync(reportPath(baseDir, state.path))) {
    errors.push(`State screenshot file not found: ${state.path}`);
  }
}

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
