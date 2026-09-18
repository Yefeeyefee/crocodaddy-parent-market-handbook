import { ACTIVITY_STATES, HOME_STATES, PAYMENT_STATES, SCREENS } from "./state-machine.mjs";
import { getProductDoc, getReviewStateOptions, SCREEN_LABELS } from "./product-docs.mjs";
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
  const title = SCREEN_LABELS[state.screen] || state.screen;
  return `<section class="screen-stack"><div class="card"><h2>${title}还在搭建中</h2><p class="key-body">这是后续业务 screen 的入口。家长咨询和家庭设置会继续遵守双方内容隔离。</p><button class="button button--primary" data-action="NAVIGATE" data-screen="home">回到首页 ${icon}</button></div></section>`;
}

function screenMarkup(state) {
  const isOnboarding = state.screen === "login" || state.screen === "privacy";
  const isImmersive = isOnboarding || state.screen === "agent";
  const content = state.screen === "home" ? renderHome(state) : state.screen === "login" ? renderLogin(state) : state.screen === "privacy" ? renderPrivacy(state) : state.screen === "insight" ? renderInsight(state) : state.screen === "agent" ? renderAgent(state) : state.screen === "activity" ? renderActivity(state) : state.screen === "action" ? renderAction(state) : state.screen === "weekend" ? renderWeekend(state) : state.screen === "course" ? renderCourse(state) : state.screen === "course-lesson" ? renderCourseLesson(state) : state.screen === "notifications" ? renderNotifications(state) : state.screen === "family" ? renderFamily(state) : state.screen === "membership" ? renderMembership(state) : state.screen === "parent-growth" ? renderParentGrowth(state) : state.screen === "child-profile" ? renderChildProfile(state) : state.screen === "settings" ? renderSettings(state) : state.screen === "account-security" ? renderAccountSecurity(state) : state.screen === "notification-settings" ? renderNotificationSettings(state) : state.screen === "privacy-settings" ? renderPrivacySettings(state) : state.screen === "help-feedback" ? renderHelpFeedback(state) : placeholderScreen(state);
  const nav = isImmersive ? "" : primaryNav(state.screen);
  return `<div class="app-view app-view--${state.screen}" data-screen-id="${state.screen}">${content}${nav}</div>`;
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

function listMarkup(items) {
  return `<ul>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
}

function reviewOptionsMarkup(options, currentValue) {
  return options.map(({ value, label, description }) => `<option value="${escapeHTML(value)}" title="${escapeHTML(description)}" ${value === currentValue ? "selected" : ""}>${escapeHTML(label)}</option>`).join("");
}

function reviewGroup({ legend, action, ariaLabel, options, value }) {
  const current = options.find((option) => option.value === value) || options[0];
  return `<fieldset class="review-group"><legend>${escapeHTML(legend)}</legend><select class="review-select" data-action="${escapeHTML(action)}" aria-label="${escapeHTML(ariaLabel)}">${reviewOptionsMarkup(options, value)}</select><p class="review-current-state"><strong>当前情况：</strong>${escapeHTML(current?.label || "未选择")} · ${escapeHTML(current?.description || "请先选择一种情况")}</p></fieldset>`;
}

export function renderApp(root, state, { focusTitle = false } = {}) {
  if (!root) throw new Error("renderApp requires a root element");
  if (!SCREENS.includes(state.screen)) throw new Error(`Unknown screen: ${state.screen}`);
  root.innerHTML = screenMarkup(state).replace(/<(h[12])(\s)/, '<$1 data-primary-title tabindex="-1"$2');
  const title = root.querySelector?.("[data-primary-title]");
  if (focusTitle) title?.focus?.({ preventScroll: true });
}

export function renderProductDocPanel(state) {
  const doc = getProductDoc(state);
  return `<div id="product-doc-content" class="product-doc" data-doc-screen="${escapeHTML(state.screen)}" data-doc-state="${escapeHTML(doc.stateValue)}" aria-live="polite"><header class="product-doc__header"><div><p class="eyebrow">核心产品文档</p><h2>${escapeHTML(doc.moduleLabel)}</h2></div><span class="product-doc__state product-doc__state--${escapeHTML(doc.stateTone)}">${escapeHTML(doc.stateLabel)}</span></header><section class="product-doc__status product-doc__status--${escapeHTML(doc.stateTone)}"><p class="section-label">当前状态说明</p><strong>${escapeHTML(doc.stateLabel)}</strong><p>${escapeHTML(doc.stateDescription)}</p></section><section class="product-doc__purpose"><p class="section-label">核心目标</p><p>${escapeHTML(doc.purpose)}</p></section><section class="product-doc__section"><h3><span>01</span>产品功能</h3>${listMarkup(doc.functionItems)}</section><section class="product-doc__section"><h3><span>02</span>产品说明</h3>${listMarkup(doc.explanationItems)}</section><section class="product-doc__section product-doc__section--dev"><h3><span>03</span>开发要求</h3>${listMarkup(doc.developmentItems)}</section><section class="product-doc__section product-doc__section--acceptance"><h3><span>04</span>状态与验收</h3>${listMarkup(doc.acceptanceItems)}</section><p class="product-doc__footer">左侧说明与手机界面、右侧状态控制保持同步。</p></div>`;
}

export function renderReviewPanel(state) {
  const screenOptions = SCREENS.map((screen) => ({ value: screen, label: SCREEN_LABELS[screen], description: `打开${SCREEN_LABELS[screen]}模块。` }));
  const homeOptions = getReviewStateOptions("home");
  const activityOptions = getReviewStateOptions("activity");
  const paymentOptions = getReviewStateOptions("payment");
  const courseOptions = getReviewStateOptions("course");
  const courseValue = state.courseCompleted === true ? "completed" : state.coursePlaying === true ? "playing" : "not-started";
  return `<div class="review-console"><p class="eyebrow">交互评审</p><h2>原型评审控制台</h2><p>右侧切换后，左侧产品文档会同步解释当前情况。</p><section class="review-l3-entry"><strong>状态对照</strong><p>面向研发、运营和产品的共同阅读，不需要理解内部状态名称。</p></section>${reviewGroup({ legend: "进入模块", action: "NAVIGATE", ariaLabel: "选择模块", options: screenOptions, value: state.screen })}${reviewGroup({ legend: "首页成长摘要", action: "HOME_STATE_CHANGED", ariaLabel: "选择首页成长摘要状态", options: homeOptions, value: state.homeState })}${reviewGroup({ legend: "最近 7 天活动数据", action: "ACTIVITY_STATE_CHANGED", ariaLabel: "选择最近 7 天活动数据状态", options: activityOptions, value: state.activityState })}${reviewGroup({ legend: "会员支付结果", action: "PAYMENT_STATE_CHANGED", ariaLabel: "选择会员支付结果", options: paymentOptions, value: state.paymentState })}${reviewGroup({ legend: "课程播放情况", action: "COURSE_STATE_CHANGED", ariaLabel: "选择课程播放情况", options: courseOptions, value: courseValue })}</div>`;
}
