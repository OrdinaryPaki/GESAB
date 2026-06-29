#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { cwd, execPath, exit } from "node:process";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

function usage() {
  console.error(
    "Usage: node validate-run-completion.mjs --base-dir <dir> [--mission-board <path>] [--interaction-map <path>] [--foundation-version <version>]",
  );
}

function argValue(args, name) {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
}

function fullPath(baseDir, value) {
  if (!value) return "";
  return isAbsolute(value) ? value : resolve(baseDir, value);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function missionIdFrom(node) {
  return node?.mission_id || node?.missionId || node?.id || node?.mission;
}

function isExcluded(node) {
  const status = String(node?.status || node?.route_status || node?.routeStatus || "").toLowerCase();
  return node?.excluded === true || node?.include === false || status === "excluded";
}

function reportPathFrom(node) {
  return (
    node?.report_path ||
    node?.reportPath ||
    node?.worker_report ||
    node?.workerReport ||
    node?.expected_report_path ||
    node?.expectedReportPath ||
    ""
  );
}

function collectMissions(node, out = []) {
  if (!node) return out;
  if (Array.isArray(node)) {
    for (const item of node) collectMissions(item, out);
    return out;
  }
  if (typeof node !== "object") return out;

  const missionId = missionIdFrom(node);
  if (missionId && !isExcluded(node)) {
    out.push({
      mission_id: String(missionId),
      report_path: reportPathFrom(node),
    });
  }

  for (const value of Object.values(node)) collectMissions(value, out);
  return out;
}

function uniqueMissions(missions) {
  const seen = new Set();
  return missions.filter((mission) => {
    if (seen.has(mission.mission_id)) return false;
    seen.add(mission.mission_id);
    return true;
  });
}

function listFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) listFiles(path, out);
    else out.push(path);
  }
  return out;
}

function text(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? match[1].trim() : "";
}

function findReport(baseDir, mission) {
  if (mission.report_path) {
    const path = fullPath(baseDir, mission.report_path);
    if (existsSync(path)) return path;
  }

  const reportFiles = listFiles(resolve(baseDir, ".visual-clone/reports")).filter((path) => path.endsWith(".xml"));
  for (const path of reportFiles) {
    const xml = readFileSync(path, "utf8");
    if (text(xml, "mission_id") === mission.mission_id) return path;
  }

  return "";
}

const args = process.argv.slice(2);
if (args.includes("--help")) {
  usage();
  exit(0);
}

const baseDir = resolve(argValue(args, "--base-dir") ?? cwd());
const missionBoard = fullPath(baseDir, argValue(args, "--mission-board") ?? ".visual-clone/blueprint/mission-board.json");
const interactionMap = argValue(args, "--interaction-map") ?? ".visual-clone/blueprint/interaction-map.json";
const foundationVersion = argValue(args, "--foundation-version");
const workerValidator = resolve(dirname(fileURLToPath(import.meta.url)), "validate-worker-report.mjs");

const errors = [];
const warnings = [];
const reportResults = [];

if (!existsSync(missionBoard)) {
  errors.push(`Mission board not found: ${missionBoard}`);
} else {
  let missions = [];
  try {
    missions = uniqueMissions(collectMissions(readJson(missionBoard)));
  } catch (error) {
    errors.push(`Mission board is not valid JSON: ${error.message}`);
  }

  if (!missions.length) errors.push("Mission board has no included missions");

  for (const mission of missions) {
    const report = findReport(baseDir, mission);
    if (!report) {
      errors.push(`Missing worker report for mission ${mission.mission_id}`);
      continue;
    }

    const validatorArgs = [workerValidator, report, "--base-dir", baseDir];
    if (foundationVersion) validatorArgs.push("--foundation-version", foundationVersion);
    if (existsSync(fullPath(baseDir, interactionMap))) validatorArgs.push("--interaction-map", interactionMap);

    const result = spawnSync(execPath, validatorArgs, { encoding: "utf8" });
    let parsed = null;
    try {
      parsed = JSON.parse(result.stdout || "{}");
    } catch {
      parsed = { valid: false, errors: ["Worker validator did not return JSON"] };
    }

    const status = parsed.status || text(readFileSync(report, "utf8"), "status");
    reportResults.push({
      mission_id: mission.mission_id,
      report,
      status,
      valid: result.status === 0 && parsed.valid === true,
      errors: parsed.errors || [],
    });

    if (result.status !== 0 || parsed.valid !== true) {
      errors.push(`Worker report failed validation for mission ${mission.mission_id}`);
    }

    if (!["ready_for_main_review", "repair_complete"].includes(status)) {
      errors.push(`Mission ${mission.mission_id} is not ready for completion: ${status || "missing status"}`);
    }
  }
}

const result = {
  valid: errors.length === 0,
  errors,
  warnings,
  reports: reportResults,
};

console.log(JSON.stringify(result, null, 2));
exit(result.valid ? 0 : 1);
