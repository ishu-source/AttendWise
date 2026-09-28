import test from "node:test";
import assert from "node:assert/strict";
import { calc, applyT } from "../src/engine/attendance.js";
import { checkLeave, leaveCounts } from "../src/engine/leaveSimulator.js";
import { schedule, getClassesForDate } from "../src/engine/timetable.js";
import { planFor, nextClassCounts } from "../src/engine/planner.js";

test("already above 90%", () => {
  const r = calc(95, 100, 10);
  assert.equal(r.st, "SAFE"); assert.equal(r.n90, 4); assert.equal(r.safe90, 6);
});
test("exactly 90%", () => {
  const r = calc(90, 100, 0);
  assert.equal(r.st, "SAFE"); assert.equal(r.n90, 0);
});
test("below 90 but recoverable", () => {
  const r = calc(88, 100, 50);
  assert.equal(r.st, "CAUTION"); assert.equal(r.n90, 47); assert.equal(r.imp90, false);
});
test("below 90 and 90 unreachable", () => {
  assert.equal(calc(80, 100, 50).imp90, true);
});
test("below 75 but recoverable", () => {
  const r = calc(65, 100, 60);
  assert.equal(r.st, "RISK"); assert.equal(r.n75, 55); assert.equal(r.safe75, 5);
});
test("irreversible below 75", () => {
  const r = calc(50, 100, 20);
  assert.equal(r.st, "IRREV"); assert.equal(r.imp75, true);
  assert.ok(Math.abs(r.max - 100 * 70 / 120) < 1e-9);
});
test("zero remaining classes", () => {
  const ok = calc(80, 100, 0);
  assert.equal(ok.n75, 0); assert.equal(ok.safe75, 0); assert.equal(ok.st, "CAUTION");
  assert.equal(calc(70, 100, 0).st, "IRREV");
  assert.equal(calc(0, 0, 0).st, "NONE");
});
test("zero conducted classes", () => {
  const r = calc(0, 0, 40);
  assert.equal(r.cur, null); assert.equal(r.st, "START"); assert.equal(r.n75, 30); assert.equal(r.n90, 36);
});
test("exactly 75% is not below the threshold", () => {
  const r = calc(75, 100, 0);
  assert.equal(r.st, "CAUTION"); assert.equal(r.n75, 0);
});
test("required classes are always whole numbers", () => {
  const r = calc(41, 50, 14);
  assert.ok(Number.isInteger(r.n75) && Number.isInteger(r.n90) && Number.isInteger(r.safe75));
});

test("leave counted as absent / attended / excluded", () => {
  const r = calc(41, 50, 14);
  const ab = applyT(r, 3, "absent"), at = applyT(r, 3, "attended"), ex = applyT(r, 3, "excluded");
  assert.deepEqual([ab.A, ab.C, ab.R], [41, 53, 11]);
  assert.deepEqual([at.A, at.C, at.R], [44, 53, 11]);
  assert.deepEqual([ex.A, ex.C, ex.R], [41, 50, 11]);
});

test("timetable: real dates, weekdays only, per-section", () => {
  const s = schedule("III ECE A");
  assert.ok(s.length > 0);
  assert.ok(s.every(c => { const w = new Date(c.d + "T00:00:00").getDay(); return w >= 1 && w <= 5; }));
  assert.ok(s[0].d >= "2026-08-29" && s[s.length - 1].d <= "2026-11-29");
  assert.equal(getClassesForDate("III ECE A", "2026-08-31").length, 6); // Monday: EBBA + GG
  assert.equal(getClassesForDate("III ECE A", "2026-08-30").length, 0); // Sunday
  assert.equal(schedule("I Year").length, 0); // unverified data is never guessed
});
test("leave uses timetable classes, not calendar days", () => {
  const wk = leaveCounts("III ECE A", "2026-09-29", "2026-10-01");
  assert.equal(wk.total, Object.values(wk.cnt).reduce((a, b) => a + b, 0));
  assert.ok(wk.total > 0);
  assert.equal(leaveCounts("III ECE A", "2026-10-03", "2026-10-04").total, 0); // Sat + Sun
});
test("leave date validation", () => {
  assert.ok(checkLeave("2026-09-28", "2026-11-29", "2026-09-01", "2026-09-30"));
  assert.ok(checkLeave("2026-09-28", "2026-11-29", "2026-10-05", "2026-10-01"));
  assert.ok(checkLeave("2026-09-28", "2026-11-29", "2026-11-28", "2026-12-02"));
  assert.equal(checkLeave("2026-09-28", "2026-11-29", "2026-10-05", "2026-10-07"), "");
});
test("planner + what-if helpers use the same engine", () => {
  const r = calc(41, 50, 14), p = planFor("III ECE A", "A", r, "2026-09-28", "2026-10-15");
  assert.ok(p.u >= 0 && p.ra === r.R - p.u && p.byP <= p.u);
  const c = nextClassCounts("III ECE A", "2026-09-28", 3, "classes");
  assert.equal(Object.values(c).reduce((a, b) => a + b, 0), 3);
});
