import { SCENARIOS } from "../scenarios.mjs";
import { renderActivitySummaryCard } from "./activity.mjs";

const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
const states = SCENARIOS.home;
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

function statusBlock(homeState, data, state = {}) {
  return `<section class="home-status home-status--${homeState}" data-home-state="${homeState}" aria-labelledby="home-status-title" role="status" aria-live="polite">
    <p class="status-kicker">${homeState === "ready" ? "本周成长摘要" : "首页状态"}</p>
    <h2 id="home-status-title">${data.title}</h2>
    <p class="key-body status-reason" data-status-reason><strong>原因：</strong>${data.reason}</p>
    <div class="status-next" data-status-next><strong>下一步</strong><p>${data.next}</p></div>
    ${state.homeRecoveryMessage ? `<p class="home-recovery-message" role="status" aria-live="polite">${state.homeRecoveryMessage}</p>` : ""}
    ${homeState === "error" ? `<div class="cached-content"><strong>保留的内容</strong><p>${data.cachedSummary}</p><time>${data.cachedAt}</time></div>` : ""}
    ${homeState === "stale" ? `<p class="cached-label">${data.updatedAt}</p>` : ""}
    <button class="button button--${homeState === "locked" ? "primary" : "quiet"} status-recovery" data-status-recovery data-action="HOME_RECOVERY" data-recovery="${homeState}">${data.recovery} ${icon("M5 12h14M12 5l7 7-7 7")}</button>
  </section>`;
}

function readyContent(data, state = {}) {
  return `<section class="ready-content" aria-label="小宇最近 7 天的成长">
    ${renderActivitySummaryCard(state)}
    <article class="parent-action"><div class="action-icon" aria-hidden="true">${icon("M20 14a4 4 0 0 1-4 4H9l-5 3v-7a4 4 0 0 1-1-2.7V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v7Z")}</div><div><div class="summary-label">和孩子一起</div><h3>今晚只聊一个小问题</h3><p>${data.action}</p></div>${icon("M9 18l6-6-6-6")}</article>
    <section class="home-module-grid" aria-label="继续陪伴">
      <button class="home-module-card home-module-card--weekend" data-action="NAVIGATE" data-screen="weekend"><span class="module-glyph" aria-hidden="true">↗</span><span class="module-copy"><span class="summary-label">本周陪伴建议</span><strong>周末去哪儿，帮你先想好</strong><span>城市自然博物馆 · 半天 · 室内</span><em>查看安排 ${icon("M5 12h14M12 5l7 7-7 7")}</em></span></button>
      <button class="home-module-card home-module-card--course" data-action="NAVIGATE" data-screen="course"><span class="module-glyph" aria-hidden="true">◒</span><span class="module-copy"><span class="summary-label">本月定制课</span><strong>把好奇心变成自己的问题</strong><span>4 周 · 6 节音频 · 配图同步</span><em>打开课程 ${icon("M5 12h14M12 5l7 7-7 7")}</em></span></button>
    </section>
  </section>`;
}

export function renderHome(state = {}) {
  const homeState = states[state.homeState] ? state.homeState : "empty";
  const data = states[homeState];
  return `<main class="home-screen" data-screen="home" data-home-state="${homeState}">
    <header class="home-header"><div><p class="eyebrow">${escapeHTML(state.childName || "小宇")}的家长空间</p><h1>早上好</h1></div><button class="icon-button" aria-label="打开通知" data-action="NAVIGATE" data-screen="notifications">${icon("M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4")}</button></header>
    <section class="mentor-entry" aria-label="鳄鱼爸爸家长咨询入口"><div class="mentor-copy"><span class="mentor-chip">鳄鱼爸爸在线</span><h2>孩子的事，<br />尽管来问我</h2><p>最近在关注什么、怎样沟通、周末怎么陪，我都可以帮你理清楚。</p><button class="button button--primary" data-action="NAVIGATE" data-screen="agent">进入鳄鱼爸爸 ${icon("M5 12h14M12 5l7 7-7 7")}</button></div><img class="mentor-avatar" src="./assets/crocodaddy-bust.png" alt="鳄鱼爸爸半身像" /></section>
    ${homeState === "ready" ? readyContent(data, state) : statusBlock(homeState, data, state)}
  </main>`;
}
