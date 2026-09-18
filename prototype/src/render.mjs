import { ACTIVITY_STATES, HOME_STATES, PAYMENT_STATES, SCREENS } from "./state-machine.mjs";
import { renderHome } from "./screens/home.mjs";
import { renderLogin, renderPrivacy } from "./screens/onboarding.mjs";
import { renderInsight } from "./screens/insight.mjs";
import { renderAgent } from "./screens/agent.mjs";
import { renderActivity } from "./screens/activity.mjs";
import { renderAction } from "./screens/action.mjs";
import { renderWeekend } from "./screens/weekend.mjs";
import { renderCourse, renderCourseLesson } from "./screens/course.mjs";
import { renderNotifications } from "./screens/notifications.mjs";
import { renderFamily } from "./screens/family.mjs";
import { renderMembership } from "./screens/membership.mjs";
import { renderParentGrowth } from "./screens/parent-growth.mjs";
import { renderChildProfile } from "./screens/child-profile.mjs";
import { renderAccountSecurity, renderHelpFeedback, renderNotificationSettings, renderPrivacySettings, renderSettings } from "./screens/settings.mjs";

const labels = { login: "登录", privacy: "隐私说明", home: "今日陪伴", insight: "成长洞察", agent: "鳄鱼爸爸", activity: "最近 7 天成长", action: "行动建议", weekend: "周末建议", course: "本月定制课", "course-lesson": "音频课", notifications: "通知", family: "我的", membership: "会员方案", "parent-growth": "家长成长", "child-profile": "孩子资料", settings: "设置", "account-security": "账号与安全", "notification-settings": "通知与活动建议", "privacy-settings": "隐私与授权", "help-feedback": "帮助与反馈" };
const icon = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
const navItems = [
  ["首页", "home", "M3 11l9-8 9 8v9H3z"],
  ["课程", "course", "M5 4h14v16H5zM9 4v16M12 8h4M12 12h4"],
  ["鳄鱼爸爸", "agent", "M5 9h14v10H5zM8 9V6h8v3"],
  ["行动", "action", "M5 4h14v16H5zM8 9h8M8 13h5M8 17h3"],
  ["我的", "family", "M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-6 8a6 6 0 0 1 12 0"]
];

function primaryNav(activeScreen) {
  const navScreen = activeScreen === "activity" ? "home" : activeScreen;
  return `<nav class="primary-nav" aria-label="主导航">${navItems.map(([label, screen, path]) => `<button class="primary-nav__item" data-action="NAVIGATE" data-nav-label="${label}" data-screen="${screen}" aria-current="${navScreen === screen ? "page" : "false"}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg><span>${label}</span></button>`).join("")}</nav>`;
}

function placeholderScreen(state) {
  const title = labels[state.screen] || state.screen;
  return `<section class="screen-stack"><div class="card"><h2>${title}还在搭建中</h2><p class="key-body">这是后续业务 screen 的入口。家长咨询和家庭设置会继续遵守双方内容隔离。</p><button class="button button--primary" data-action="NAVIGATE" data-screen="home">回到首页 ${icon}</button></div></section>`;
}

function screenMarkup(state) {
  const isOnboarding = state.screen === "login" || state.screen === "privacy";
  const content = state.screen === "home" ? renderHome(state) : state.screen === "login" ? renderLogin(state) : state.screen === "privacy" ? renderPrivacy(state) : state.screen === "insight" ? renderInsight(state) : state.screen === "agent" ? renderAgent(state) : state.screen === "activity" ? renderActivity(state) : state.screen === "action" ? renderAction(state) : state.screen === "weekend" ? renderWeekend(state) : state.screen === "course" ? renderCourse(state) : state.screen === "course-lesson" ? renderCourseLesson(state) : state.screen === "notifications" ? renderNotifications(state) : state.screen === "family" ? renderFamily(state) : state.screen === "membership" ? renderMembership(state) : state.screen === "parent-growth" ? renderParentGrowth(state) : state.screen === "child-profile" ? renderChildProfile(state) : state.screen === "settings" ? renderSettings(state) : state.screen === "account-security" ? renderAccountSecurity(state) : state.screen === "notification-settings" ? renderNotificationSettings(state) : state.screen === "privacy-settings" ? renderPrivacySettings(state) : state.screen === "help-feedback" ? renderHelpFeedback(state) : placeholderScreen(state);
  const nav = isOnboarding ? "" : primaryNav(state.screen);
  return `<div class="app-view app-view--${state.screen}" data-screen-id="${state.screen}">${content}${nav}</div>`;
}

export function renderApp(root, state, { focusTitle = false } = {}) {
  if (!root) throw new Error("renderApp requires a root element");
  if (!SCREENS.includes(state.screen)) throw new Error(`Unknown screen: ${state.screen}`);
  root.innerHTML = screenMarkup(state).replace(/<(h[12])(\s)/, '<$1 data-primary-title tabindex="-1"$2');
  const title = root.querySelector?.("[data-primary-title]");
  if (focusTitle) title?.focus?.({ preventScroll: true });
}

export function renderReviewPanel(state) {
  const screenOptions = SCREENS.map((screen) => `<option value="${screen}" ${screen === state.screen ? "selected" : ""}>${labels[screen]}</option>`).join("");
  const homeOptions = HOME_STATES.map((value) => `<option value="${value}" ${value === state.homeState ? "selected" : ""}>${value}</option>`).join("");
  const activityOptions = ACTIVITY_STATES.map((value) => `<option value="${value}" ${value === state.activityState ? "selected" : ""}>${value}</option>`).join("");
  const paymentOptions = PAYMENT_STATES.map((value) => `<option value="${value}" ${value === state.paymentState ? "selected" : ""}>${value}</option>`).join("");
  return `<div><p class="eyebrow">REVIEW CONSOLE</p><h2>原型评审控制台</h2><p>仅桌面视图显示，不进入手机画布。</p><section class="review-l3-entry"><strong>L3 · 及时支持</strong><p>独立评审入口，不与普通通知混排。</p></section><fieldset class="review-group"><legend>屏幕切换</legend><select class="review-select" data-action="NAVIGATE" aria-label="选择屏幕">${screenOptions}</select></fieldset><fieldset class="review-group"><legend>首页六状态</legend><select class="review-select" data-action="HOME_STATE_CHANGED" aria-label="选择首页状态">${homeOptions}</select></fieldset><fieldset class="review-group"><legend>活动数据状态</legend><select class="review-select" data-action="ACTIVITY_STATE_CHANGED" aria-label="选择活动数据状态">${activityOptions}</select></fieldset><fieldset class="review-group"><legend>支付结果</legend><select class="review-select" data-action="PAYMENT_STATE_CHANGED" aria-label="选择支付结果">${paymentOptions}</select></fieldset></div>`;
}
