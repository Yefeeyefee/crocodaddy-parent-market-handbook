export const SCREENS = [
  "login",
  "privacy",
  "home",
  "insight",
  "agent",
  "activity",
  "action",
  "weekend",
  "course",
  "course-lesson",
  "notifications",
  "family",
  "membership",
  "parent-growth",
  "child-profile",
  "settings",
  "account-security",
  "notification-settings",
  "privacy-settings",
  "help-feedback",
];

export const HOME_STATES = ["initializing", "empty", "ready", "stale", "locked", "error"];
export const PAYMENT_STATES = ["idle", "processing", "success", "cancelled", "failed", "syncing"];
export const ACTION_FEEDBACK = ["remind", "not-fit", "change"];
export const WEEKEND_FEEDBACK = ["remind", "not-fit", "change"];
export const COURSE_LESSON_IDS = ["starlight", "shadow-clock", "question-map", "moon-note", "time-capsule", "family-sky"];
export const ACTIVITY_STATES = ["initializing", "empty", "ready", "stale", "error"];
const PLANS = ["monthly", "quarterly", "annual"];

export function createInitialState() {
  return {
    screen: "login",
    homeState: "empty",
    selectedPlan: "annual",
    parentFullAccess: true,
    paymentState: "idle",
    agentQuotaRemaining: 2,
    locationEnabled: false,
    notificationsEnabled: true,
    quietHoursEnabled: true,
    activityState: "ready",
    termsAccepted: false,
    codeSent: false,
    coursePlaying: false,
    courseCompleted: false,
  };
}

export function transition(state, event) {
  if (event.type === "SEND_CODE" && state.screen === "login") return { ...state, codeSent: true };
  if (event.type === "PHONE_VERIFIED") return { ...state, screen: "privacy", phone: event.phone };
  if (event.type === "CONSENT_ACCEPTED") return { ...state, screen: "home", homeState: "empty" };
  if (event.type === "NAVIGATE" && SCREENS.includes(event.screen)) return { ...state, screen: event.screen };
  if (event.type === "HOME_STATE_CHANGED" && HOME_STATES.includes(event.value)) {
    return { ...state, homeState: event.value };
  }
  if (event.type === "ACTIVITY_STATE_CHANGED" && ACTIVITY_STATES.includes(event.value)) {
    return { ...state, activityState: event.value };
  }
  if (event.type === "HOME_RECOVERY" && state.screen === "home" && HOME_STATES.includes(event.recovery)) {
    if (event.recovery === "ready") return { ...state, screen: "activity", homeRecoveryMessage: "" };
    if (event.recovery === "locked") return { ...state, screen: "membership", homeRecoveryMessage: "" };
    const messages = {
      initializing: "首页仍在准备中，请稍后重新查看。",
      empty: "目前还没有新的成长摘要，稍后可以重新查看。",
      stale: "已保留上次摘要，稍后可重新同步。",
      error: "暂时无法同步，已保留安全缓存；稍后可重新尝试。",
    };
    return { ...state, homeRecoveryMessage: messages[event.recovery] };
  }
  if (event.type === "PLAN_SELECTED" && PLANS.includes(event.plan)) {
    return { ...state, selectedPlan: event.plan, parentFullAccess: event.plan === "annual" };
  }
  if (event.type === "LOCATION_TOGGLED" && typeof event.enabled === "boolean") return { ...state, locationEnabled: event.enabled };
  if (event.type === "NOTIFICATIONS_TOGGLED" && typeof event.enabled === "boolean") return { ...state, notificationsEnabled: event.enabled };
  if (event.type === "QUIET_HOURS_TOGGLED" && typeof event.enabled === "boolean") return { ...state, quietHoursEnabled: event.enabled };
  if (event.type === "TERMS_TOGGLED" && typeof event.accepted === "boolean") return { ...state, termsAccepted: event.accepted };
  if (event.type === "PAYMENT_START" && state.termsAccepted === true && PLANS.includes(event.plan || state.selectedPlan)) {
    const plan = event.plan || state.selectedPlan;
    return { ...state, selectedPlan: plan, parentFullAccess: plan === "annual", paymentState: "processing" };
  }
  if (event.type === "PAYMENT_STATE_CHANGED" && PAYMENT_STATES.includes(event.value)) {
    return { ...state, paymentState: event.value };
  }
  if (event.type === "ACTION_SAVED" && state.screen === "agent") return { ...state, screen: "action", actionSaved: true };
  if (event.type === "ACTION_FEEDBACK" && state.screen === "action" && ACTION_FEEDBACK.includes(event.feedback)) return { ...state, screen: "action", actionFeedback: event.feedback };
  if (event.type === "WEEKEND_FEEDBACK" && state.screen === "weekend" && WEEKEND_FEEDBACK.includes(event.feedback)) return { ...state, weekendFeedback: event.feedback };
  if (event.type === "COURSE_LESSON_OPEN" && state.screen === "course" && COURSE_LESSON_IDS.includes(event.lessonId)) {
    return { ...state, screen: "course-lesson", courseLessonId: event.lessonId, coursePlaying: false, courseCompleted: false };
  }
  if (event.type === "COURSE_PLAY_TOGGLED" && state.screen === "course-lesson") return { ...state, coursePlaying: !state.coursePlaying };
  if (event.type === "COURSE_COMPLETED" && state.screen === "course-lesson") return { ...state, courseCompleted: true, coursePlaying: false };
  if (event.type === "VOICE_TOGGLE" && state.screen === "agent") return { ...state, voiceListening: !state.voiceListening };
  if (event.type === "AGENT_SEND" && state.screen === "agent") return { ...state, agentMessageSent: true };
  return state;
}
