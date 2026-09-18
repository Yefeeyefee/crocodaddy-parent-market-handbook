import { createInitialState, transition } from "./state-machine.mjs";
import { renderApp as defaultRenderApp, renderReviewPanel as defaultRenderReviewPanel } from "./render.mjs";
import { pushScreenTransition, popScreenTransition } from "./navigation-history.mjs";

export function createAppController({
  root,
  reviewRoot,
  renderApp = defaultRenderApp,
  renderReviewPanel = defaultRenderReviewPanel,
  transitionFn = transition,
  initialState = createInitialState(),
} = {}) {
  if (!root || !reviewRoot) throw new Error("createAppController requires root and reviewRoot");
  let state = initialState;
  let navigationHistory = [];
  function scrollContainer() { return root.querySelector("[data-screen]") || root.querySelector(".onboarding") || root.parentElement; }
  function currentScrollTop() { return scrollContainer()?.scrollTop || 0; }
  function attributeValue(control, attribute) {
    const value = control.getAttribute?.(attribute) ?? control.attributes?.[attribute];
    return value && typeof value === "object" && "value" in value ? value.value : value;
  }
  function focusIdentity(control) {
    const attributes = ["data-action", "data-plan", "data-feedback", "data-recovery", "data-screen", "aria-label", "name"];
    return Object.fromEntries(attributes.filter((attribute) => attributeValue(control, attribute) !== undefined && attributeValue(control, attribute) !== null).map((attribute) => [attribute, attributeValue(control, attribute)]));
  }
  function findFocusable(identity) {
    if (!identity || !Object.keys(identity).length) return null;
    return [root, reviewRoot].flatMap((container) => Array.from(container.querySelectorAll?.("[data-action]") || [])).find((candidate) => Object.entries(identity).every(([attribute, value]) => attributeValue(candidate, attribute) === value)) || null;
  }
  function render(stateToRender, scrollTop = 0, { focusTitle = false, focusIdentity: identity = null } = {}) {
    state = stateToRender;
    renderApp(root, state, { focusTitle });
    reviewRoot.innerHTML = renderReviewPanel(state);
    const container = scrollContainer();
    if (container) container.scrollTop = scrollTop;
    if (!focusTitle) findFocusable(identity)?.focus?.({ preventScroll: true });
  }
  function dispatch(event, { direct = false, focusIdentity: identity = null } = {}) {
    if (event.type === "GO_BACK") {
      const result = popScreenTransition(navigationHistory);
      navigationHistory = result.history;
      if (result.entry) render(result.entry.state, result.entry.scrollTop, { focusTitle: true });
      return state;
    }
    const beforeState = state;
    const nextState = transitionFn(state, event);
    const screenChanged = beforeState.screen !== nextState.screen;
    navigationHistory = pushScreenTransition(navigationHistory, beforeState, nextState, { direct, scrollTop: currentScrollTop() });
    render(nextState, screenChanged ? 0 : currentScrollTop(), { focusTitle: screenChanged, focusIdentity: identity });
    return state;
  }
  function handleAction(event) {
    const control = event.target.closest?.("[data-action]");
    if (!control) return state;
    if (event.type === "submit") event.preventDefault();
    const action = control.dataset.action;
    const identity = focusIdentity(control);
    const route = (nextEvent, options = {}) => dispatch(nextEvent, { ...options, focusIdentity: identity });
    if (action === "GO_BACK") return dispatch({ type: "GO_BACK" });
    if (action === "SEND_CODE") return route({ type: "SEND_CODE" });
    if (action === "NAVIGATE") return route({ type: "NAVIGATE", screen: control.dataset.screen || control.value }, { direct: control.classList?.contains("primary-nav__item") });
    if (action === "PHONE_VERIFIED" || action === "PHONE_LOGIN") return route({ type: "PHONE_VERIFIED", phone: control.querySelector?.('[name="phone"]')?.value || "" });
    if (action === "CONSENT_ACCEPTED") return route({ type: "CONSENT_ACCEPTED" });
    if (action === "HOME_RECOVERY") return route({ type: "HOME_RECOVERY", recovery: control.dataset.recovery });
    if (action === "ACTIVITY_STATE_CHANGED") return route({ type: "ACTIVITY_STATE_CHANGED", value: control.value });
    if (action === "ACTION_SAVED") return route({ type: "ACTION_SAVED" });
    if (action === "ACTION_FEEDBACK") return route({ type: "ACTION_FEEDBACK", feedback: control.dataset.feedback });
    if (action === "WEEKEND_FEEDBACK") return route({ type: "WEEKEND_FEEDBACK", feedback: control.dataset.feedback });
    if (action === "COURSE_LESSON_OPEN") return route({ type: "COURSE_LESSON_OPEN", lessonId: control.dataset.lessonId });
    if (action === "COURSE_PLAY_TOGGLED") return route({ type: "COURSE_PLAY_TOGGLED" });
    if (action === "COURSE_COMPLETED") return route({ type: "COURSE_COMPLETED" });
    if (action === "VOICE_TOGGLE") return route({ type: "VOICE_TOGGLE" });
    if (action === "AGENT_SEND") return route({ type: "AGENT_SEND" });
    if (action === "PLAN_SELECTED") return route({ type: "PLAN_SELECTED", plan: control.dataset.plan });
    if (action === "PAYMENT_START") return route({ type: "PAYMENT_START", plan: control.dataset.plan });
    if (action === "LOCATION_TOGGLED") return route({ type: "LOCATION_TOGGLED", enabled: control.dataset.enabled === "true" });
    if (action === "HOME_STATE_CHANGED") return route({ type: "HOME_STATE_CHANGED", value: control.value });
    if (action === "PAYMENT_STATE_CHANGED") return route({ type: "PAYMENT_STATE_CHANGED", value: control.value });
    if (action === "TERMS_TOGGLED") return route({ type: "TERMS_TOGGLED", accepted: control.checked });
    if (action === "NOTIFICATIONS_TOGGLED") return route({ type: "NOTIFICATIONS_TOGGLED", enabled: control.dataset.enabled === "true" });
    if (action === "QUIET_HOURS_TOGGLED") return route({ type: "QUIET_HOURS_TOGGLED", enabled: control.dataset.enabled === "true" });
    return state;
  }
  function getState() { return state; }
  function mount() { render(state); return controller; }
  const controller = { dispatch, handleAction, getState, mount };
  return controller;
}
