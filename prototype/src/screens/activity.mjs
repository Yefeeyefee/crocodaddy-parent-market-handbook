import { SCENARIOS } from "../scenarios.mjs";

const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
const validStates = new Set(["initializing", "empty", "ready", "stale", "error"]);

export function renderActivitySummaryCard(state = {}) {
  const data = SCENARIOS.activity;
  const growth = SCENARIOS.home.ready;
  const activityState = validStates.has(state.activityState) ? state.activityState : "ready";
  const childName = escapeHTML(state.childName || "小宇");
  if (["initializing", "empty", "error"].includes(activityState)) {
    const message = {
      initializing: "活动片段正在整理，稍后再来看看。",
      empty: "还没有足够内容形成小结，再陪小宇完成一小步。",
      error: "暂时没能更新活动小结，我们先不编造新的判断。",
    }[activityState];
    return `<article class="activity-summary-card activity-summary-card--state" aria-labelledby="activity-summary-title"><div class="activity-summary-head"><div><p class="section-label">${childName}最近在做什么</p><h2 id="activity-summary-title">活动小结</h2></div><span class="activity-range">${data.range}</span></div><p class="activity-summary-lead">${message}</p><button class="button button--quiet activity-summary-button" data-action="NAVIGATE" data-screen="activity">查看活动状态 ${icon("M5 12h14M12 5l7 7-7 7")}</button><p class="activity-summary-privacy">只展示去隐私后的活动摘要，不显示聊天原文。</p></article>`;
  }
  const interest = data.stats.find((stat) => stat.label === "兴趣");
  const participation = data.stats.find((stat) => stat.label === "参与");
  const activityCount = data.stats.find((stat) => stat.label === "活动");
  return `<article class="activity-summary-card growth-line-card" aria-labelledby="activity-summary-title"><div class="activity-summary-head"><div><p class="section-label">成长线索</p><h2 id="activity-summary-title">${growth.title}</h2></div><span class="activity-range">${data.range}</span></div><p class="activity-summary-lead" data-status-reason><strong>看见了什么：</strong>${growth.reason}</p><div class="growth-line-signal"><span>最近常回到</span><strong>${interest?.value || "还在形成"}</strong></div><div class="activity-summary-change"><span class="section-label">一个小变化</span><strong>${data.change.title}</strong><p>${data.change.body}</p><span class="activity-evidence">${data.change.evidence}</span></div><div class="growth-line-meta"><span>${participation?.label || "参与"} ${participation?.value || "—"} · ${activityCount?.label || "活动"} ${activityCount?.value || "—"}</span><span>${data.recent.length} 个活动摘要</span></div><button class="button button--quiet activity-summary-button" data-status-recovery data-action="HOME_RECOVERY" data-recovery="ready">${growth.recovery} ${icon("M5 12h14M12 5l7 7-7 7")}</button><p class="activity-summary-privacy">只展示去隐私后的活动摘要，不显示聊天原文。</p></article>`;
}

function stateCard(activityState) {
  const content = {
    initializing: ["正在整理小宇最近的活动", "同步完成后，鳄鱼爸爸会帮你把值得记住的片段整理出来。"],
    empty: ["还没有足够内容形成小结", "再陪小宇完成一小步，稍后再来看看。"],
    error: ["暂时没能更新活动小结", "我们先保留安全状态，稍后可以再回来看看。"],
  }[activityState];
  return `<section class="activity-state-card" role="status" aria-live="polite"><p class="section-label">活动小结</p><h2>${content[0]}</h2><p class="key-body">${content[1]}</p><button class="button button--primary" data-action="NAVIGATE" data-screen="home">返回首页 ${icon("M15 18 9 12l6-6")}</button></section>`;
}

function staleNotice(data) {
  return `<div class="activity-stale-note" role="status" aria-live="polite"><span class="activity-stale-dot" aria-hidden="true"></span><span>暂时没有收到最新片段，先看上次整理好的内容 · ${data.updatedAt}</span></div>`;
}

export function renderActivity(state = {}) {
  const data = SCENARIOS.activity;
  const activityState = validStates.has(state.activityState) ? state.activityState : "ready";
  const childName = escapeHTML(state.childName || "小宇");
  if (["initializing", "empty", "error"].includes(activityState)) {
    return `<main class="app-view activity-screen" data-screen="activity" data-activity-state="${activityState}"><header class="app-view__header"><div><p class="eyebrow">成长线索 · 详情</p><h1>${childName}最近 7 天的成长</h1></div><button class="icon-button" aria-label="返回首页" data-action="GO_BACK">${icon("M15 18 9 12l6-6")}</button></header>${stateCard(activityState)}<p class="activity-privacy-note">只展示去隐私后的成长摘要，不显示孩子和鳄鱼爸爸的聊天原文。</p></main>`;
  }
  return `<main class="app-view activity-screen" data-screen="activity" data-activity-state="${activityState}"><header class="app-view__header"><div><p class="eyebrow">成长线索 · 详情</p><h1>${childName}最近 7 天的成长</h1></div><button class="icon-button" aria-label="返回首页" data-action="GO_BACK">${icon("M15 18 9 12l6-6")}</button></header>${activityState === "stale" ? staleNotice(data) : ""}<section class="activity-overview" aria-labelledby="activity-overview-title"><div class="activity-overview-topline"><span class="section-label">${data.range}的成长摘要</span><span class="activity-updated">${data.updatedAt}</span></div><h2 id="activity-overview-title">${data.summary}</h2><div class="activity-detail-stats">${data.stats.map((stat) => `<div class="activity-detail-stat"><span>${stat.label}</span><strong>${stat.value}</strong><small>${stat.note}</small></div>`).join("")}</div></section><section class="activity-change-card" aria-labelledby="activity-change-title"><p class="section-label">一个小变化</p><h2 id="activity-change-title">${data.change.title}</h2><p>${data.change.body}</p><span class="activity-evidence">${data.change.evidence}</span></section><section class="activity-records" aria-labelledby="activity-records-title"><div class="activity-section-heading"><div><p class="section-label">最近活动</p><h2 id="activity-records-title">最近 7 天做过的三件小事</h2></div><span class="activity-count">${data.recent.length} 条</span></div><div class="activity-record-list">${data.recent.map((record) => `<article class="activity-record"><span class="activity-record-icon" aria-hidden="true">${record.icon}</span><div class="activity-record-copy"><div><span class="activity-record-type">${record.type}</span><time>${record.date}</time></div><h3>${record.title}</h3><p>${record.result}</p></div></article>`).join("")}</div></section><section class="activity-next"><p class="section-label">给家长的下一步</p><h2>今晚只问一个问题</h2><p>${data.next}</p><button class="button button--primary" data-action="NAVIGATE" data-screen="agent">问鳄鱼爸爸怎么继续 ${icon("M5 12h14M12 5l7 7-7 7")}</button></section><p class="activity-privacy-note">只展示去隐私后的成长摘要，不显示孩子和鳄鱼爸爸的聊天原文。</p></main>`;
}
