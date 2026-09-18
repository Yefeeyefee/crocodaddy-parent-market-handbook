import { SCENARIOS } from "../scenarios.mjs";
const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;

export function renderAction(state = {}) {
  const data = state.actionFeedback === "change" ? SCENARIOS.action.alternate : SCENARIOS.action;
  const confirmation = state.actionFeedback === "remind" ? `<div class="feedback-confirmation" role="status">提醒已设置：今晚 20:30（原型演示，不触发真实推送）</div>` : state.actionFeedback === "not-fit" ? `<div class="feedback-confirmation" role="status">已记录偏好，后续会减少此类建议。</div>` : state.actionFeedback === "change" ? `<div class="feedback-confirmation" role="status">已换一个行动，下面是第二个行动。</div>` : "";
  return `<main class="app-view action-screen" data-screen="action"><header class="app-view__header"><div><p class="eyebrow">亲子行动</p><h1>今晚的一小步</h1></div><button class="icon-button" aria-label="返回鳄鱼爸爸" data-action="GO_BACK">${icon("M15 18 9 12l6-6")}</button></header>
    <section class="action-card"><div class="action-meta"><span>约 3 分钟</span><span>在家</span><span>无需准备</span></div><h2>${data.title}</h2><p class="key-body">${data.lead}</p><div class="steps"><p class="section-label">三步做法</p>${data.steps.map((step, i) => `<div class="action-step"><b>${i + 1}</b><p>${step}</p></div>`).join("")}</div><div class="opening"><b>开场话术</b><p class="key-body">${data.opening}</p></div></section>
    <section class="feedback-card"><p class="section-label">这个行动适合今晚吗？</p><div class="feedback-actions"><button class="button button--quiet" data-action="ACTION_FEEDBACK" data-feedback="remind">提醒我 ${icon("M12 3v18M3 12h18")}</button><button class="button button--quiet" data-action="ACTION_FEEDBACK" data-feedback="not-fit">不太适合</button><button class="button button--quiet" data-action="ACTION_FEEDBACK" data-feedback="change">换一个 ${icon("M5 12h14M12 5l7 7-7 7")}</button></div>${confirmation}</section>
  </main>`;
}
