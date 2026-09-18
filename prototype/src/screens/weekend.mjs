import { SCENARIOS } from "../scenarios.mjs";

const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
const arrow = () => icon("M5 12h14M12 5l7 7-7 7");
const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));

export function renderWeekend(state = {}) {
  const childName = escapeHTML(state.childName || "小宇");
  const data = state.weekendFeedback === "change" ? SCENARIOS.weekend.alternate : SCENARIOS.weekend.primary;
  const confirmation = state.weekendFeedback === "remind"
    ? `<div class="feedback-confirmation" role="status">提醒已设置：周五 18:30（原型演示，不触发真实推送）</div>`
    : state.weekendFeedback === "not-fit"
      ? `<div class="feedback-confirmation" role="status">已记下这次偏好，后续会减少相似的周末建议。</div>`
      : state.weekendFeedback === "change"
        ? `<div class="feedback-confirmation" role="status">已换一个安排，下面是新的周末建议。</div>`
        : "";
  const locationNote = state.locationEnabled === true
    ? "已开启城市级位置 · 推荐会参考距离和室内外场景"
    : "还没开启位置权限 · 现在先看一条通用示例";
  return `<main class="app-view weekend-screen" data-screen="weekend">
    <header class="app-view__header"><div><p class="eyebrow">给 ${childName} 的周末</p><h1>周末陪伴建议</h1></div><button class="icon-button" aria-label="返回首页" data-action="GO_BACK">${icon("M15 18 9 12l6-6")}</button></header>
    <div class="weekend-location-note" role="status">${icon("M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z")}<span>${locationNote}</span></div>
    <section class="weekend-hero" aria-labelledby="weekend-recommendation-title">
      <div class="weekend-hero-art" aria-hidden="true"><span class="weekend-sun"></span><span class="weekend-orbit weekend-orbit--one"></span><span class="weekend-orbit weekend-orbit--two"></span><span class="weekend-hero-mark">去<br />发现</span></div>
      <div class="weekend-hero-copy"><span class="weekend-kicker">${data.label}</span><h2 id="weekend-recommendation-title">${data.title}</h2><p>${data.lead}</p></div>
    </section>
    <section class="weekend-details" aria-label="活动详情">
      <div class="weekend-detail-grid"><div><span class="summary-label">去哪儿</span><strong>${data.place}</strong><span>${data.area}</span></div><div><span class="summary-label">什么时候</span><strong>${data.when}</strong><span>预计花费 · ${data.cost}</span></div></div>
      <div class="weekend-tags">${data.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      <article class="weekend-reason"><p class="section-label">为什么适合${childName}</p><p class="key-body">${data.reason}</p></article>
      <article class="weekend-prep"><p class="section-label">出发前准备</p><p class="key-body">${data.prep}</p></article>
      <div class="steps"><p class="section-label">到了以后这样玩</p>${data.steps.map((step, index) => `<div class="action-step"><b>${index + 1}</b><p>${step}</p></div>`).join("")}</div>
      <div class="opening"><b>开场话术</b><p class="key-body">${data.opening}</p></div>
    </section>
    <section class="feedback-card weekend-feedback-card"><p class="section-label">这个周末适合你们吗？</p><div class="feedback-actions"><button class="button button--quiet" data-action="WEEKEND_FEEDBACK" data-feedback="remind">提醒我 ${icon("M12 3v18M3 12h18")}</button><button class="button button--quiet" data-action="WEEKEND_FEEDBACK" data-feedback="not-fit">不太适合</button><button class="button button--quiet" data-action="WEEKEND_FEEDBACK" data-feedback="change">换一个 ${arrow()}</button></div>${confirmation}</section>
    <p class="weekend-source-note">示例活动 · 原型不连接实时活动数据，也不代替家长做出出行决定。</p>
  </main>`;
}
