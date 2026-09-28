// Loads the whole app with a fake browser and exercises every view and the advisor.
import test from "node:test";
import assert from "node:assert/strict";

const els = {};
const mk = () => ({ innerHTML: "", value: "", hidden: false, style: {}, firstChild: null, textContent: "", querySelector: () => mk(), focus() {} });
const store = () => ({ _d: {}, getItem(k) { return this._d[k] ?? null; }, setItem(k, v) { this._d[k] = v; }, removeItem(k) { delete this._d[k]; } });
globalThis.document = { getElementById: i => els[i] || (els[i] = mk()), documentElement: { dataset: {} } };
globalThis.localStorage = store(); globalThis.sessionStorage = store();
globalThis.getComputedStyle = () => ({ getPropertyValue: () => "#000" });
globalThis.matchMedia = () => ({ matches: false }); globalThis.scrollTo = () => {};

const { St } = await import("../src/state.js");
const app = await import("../src/app.js");
const { demo } = await import("../src/components/attendance.js");
const { dash } = await import("../src/components/dashboard.js");
const { plan } = await import("../src/components/planner.js");
const { up } = await import("../src/components/upcoming.js");
const { sim } = await import("../src/components/whatIf.js");
const { leave } = await import("../src/components/leaveSimulator.js");
const { how } = await import("../src/components/landing.js");
const { advisor, buildContext } = await import("../src/components/chatbot.js");

test("every view renders for a section with demo data", () => {
  St.user = "RA2411030050054"; St.sec = "III ECE A"; demo();
  for (const [n, f] of Object.entries({ dash, plan, up, sim, leave, how })) {
    const html = f(); assert.ok(typeof html === "string" && html.length > 100, n);
    assert.ok(!html.includes("undefined") && !html.includes("NaN"), n + " contains undefined/NaN");
  }
  assert.ok(dash().includes("IRREVERSIBLE"));
  assert.ok(localStorage.getItem("aw_d_RA2411030050054")); // persisted
});
test("every navigation view renders through render()", () => {
  for (const [v] of app.TABS) { St.view = v; app.render(); }
});
test("I Year shows the verification warning", () => {
  St.sec = "I Year"; assert.ok(dash().includes("requires verification")); St.sec = "III ECE A";
});
test("advisor answers common questions from the engine", () => {
  for (const q of ["Can I skip tomorrow?", "How many can I miss?", "Am I safe?", "Can I reach 90%?", "What if I take leave?",
    "Show my risky subjects", "What happens if I miss the next 3 classes?", "What should I attend this week?",
    "Can I recover from 68%?", "Which subject is most dangerous?", "Will taking leave from October 5 to October 7 put me below 75%?"]) {
    const a = advisor(q); assert.ok(a.length > 20 && !a.includes("NaN") && !a.includes("undefined"), q + " -> " + a);
    assert.ok(!a.startsWith("I can help with attendance"), "fell through: " + q);
  }
  assert.ok(advisor("asdf").startsWith("I can help with attendance"));
});
test("advisor context has the required fields", () => {
  const c = buildContext();
  for (const k of ["section", "today", "semesterEnd", "subjects", "upcomingClasses", "whatIf", "leaveSimulation"]) assert.ok(k in c, k);
});
