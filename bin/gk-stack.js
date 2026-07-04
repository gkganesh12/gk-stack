#!/usr/bin/env node
// gk-stack — installer CLI for the Grounded Knowledge Stack.
// Zero dependencies by design (GK layer C: every dependency is context and surface).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CWD = process.cwd();
const LIBS = ['skills-library', 'skills-extra'];

const log = (s) => console.log(s);
const warn = (s) => console.log(`  ! ${s}`);
const ok = (s) => console.log(`  + ${s}`);

function copyIfAbsent(src, dest) {
  if (fs.existsSync(dest)) {
    warn(`${path.relative(CWD, dest)} already exists — skipped (not overwriting your file)`);
    return false;
  }
  fs.cpSync(src, dest, { recursive: true });
  ok(path.relative(CWD, dest));
  return true;
}

function init() {
  log('Installing the GK-Stack spine into ' + CWD + '\n');
  copyIfAbsent(path.join(ROOT, 'starter', 'CLAUDE.md'), path.join(CWD, 'CLAUDE.md'));
  const starterClaude = path.join(ROOT, 'starter', '.claude');
  for (const entry of ['settings.json', path.join('commands', 'ship.md'),
                       path.join('commands', 'triage.md'), path.join('skills', 'gk-reviewer')]) {
    const dest = path.join(CWD, '.claude', entry);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    copyIfAbsent(path.join(starterClaude, entry), dest);
  }
  log(`
Next steps (your first hour):
  1. Open CLAUDE.md and replace every <<PLACEHOLDER>> — or let the agent do it
     (fill-in prompt: docs/GK-STACK-IMPLEMENTATION.md §2 in the gk-stack repo).
  2. Open .claude/settings.json and swap the npm example commands for your real ones.
  3. Smoke-test: plan mode -> approve -> hook formats -> /ship verifies before committing.
  4. Commit CLAUDE.md and .claude/ — the stack is a team asset, it lives in git.

When a specific pain shows up:  npx gk-stack list  ·  npx gk-stack add <skill>`);
}

function findSkill(name) {
  const slug = name.startsWith('gk-') ? name : `gk-${name}`;
  for (const lib of LIBS) {
    const dir = path.join(ROOT, lib, slug);
    if (fs.existsSync(path.join(dir, 'SKILL.md'))) return { slug, dir, lib };
  }
  return null;
}

function add(name) {
  if (!name) { log('Usage: npx gk-stack add <skill>   (see: npx gk-stack list)'); process.exit(1); }
  const found = findSkill(name);
  if (!found) {
    log(`No skill named "${name}". Run: npx gk-stack list`);
    process.exit(1);
  }
  const dest = path.join(CWD, '.claude', 'skills', found.slug);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (copyIfAbsent(found.dir, dest)) {
    log(`\nInstalled ${found.slug} (from ${found.lib}). Restart Claude Code to load it.`);
    log('Reminder — one review gate: never run gk-reviewer and gk-review together (PRD R15).');
  }
}

function firstSentence(desc) {
  const cut = desc.indexOf(' Triggers on');
  const s = (cut > 0 ? desc.slice(0, cut) : desc).replace(/\s+/g, ' ').trim();
  return s.length > 100 ? s.slice(0, 97) + '...' : s;
}

function readDescription(dir) {
  try {
    const t = fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8');
    const fm = t.split('---')[1] || '';
    const m = fm.match(/description:\s*>-?\n((?:[ \t]+.*\n?)+)/);
    if (m) return m[1].replace(/\n/g, ' ');
    const single = fm.match(/description:\s*(.+)/);
    return single ? single[1] : '';
  } catch { return ''; }
}

function list() {
  for (const lib of LIBS) {
    const dir = path.join(ROOT, lib);
    const skills = fs.readdirSync(dir).filter((d) => d.startsWith('gk-')).sort();
    log(`\n${lib} (${skills.length})${lib === 'skills-library' ? ' — the curated large-codebase set' : ''}`);
    for (const s of skills) {
      log(`  ${s.padEnd(18)} ${firstSentence(readDescription(path.join(dir, s)))}`);
    }
  }
  log('\nInstall one:  npx gk-stack add <skill>');
}

function help() {
  log(`gk-stack — the Grounded Knowledge Stack, installed per pain

  npx gk-stack init          copy the spine into this repo (CLAUDE.md, settings,
                             /ship, /triage, gk-reviewer — one always-on skill)
  npx gk-stack add <skill>   install one driver into .claude/skills/
  npx gk-stack list          all 29 drivers with one-liners

Method, PRD, and proof: https://github.com/gkganesh12/gk-stack`);
}

const [, , cmd, arg] = process.argv;
({ init, add: () => add(arg), list, help }[cmd] || help)();
