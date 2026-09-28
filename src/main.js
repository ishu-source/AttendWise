// Entry point: loads styles, wires inline event handlers, restores the session, first render.
import "./styles/main.css";
import { St, save } from "./state.js";
import { NOW, addD } from "./utils/dates.js";
import { ld } from "./utils/storage.js";
import { render, go, setSec, theme } from "./app.js";
import { loadUser, logout, doAuth } from "./auth/auth.js";
import { demo, clr, setIn } from "./components/attendance.js";
import { setPlan } from "./components/planner.js";
import { setL } from "./components/leaveSimulator.js";
import { QQ, ask, toggleChat } from "./components/chatbot.js";

// The UI is built from HTML strings, so onclick="go('dash')" style handlers look these names up on window.
Object.assign(window, { St, NOW, QQ, addD, save, render, go, setSec, theme, logout, doAuth, demo, clr, setIn, setPlan, setL, ask, toggleChat });

try {
  const r = sessionStorage.getItem("aw_session");
  if (r && ld("aw_users", {})[r]) loadUser(r);
} catch (e) {}
render();
