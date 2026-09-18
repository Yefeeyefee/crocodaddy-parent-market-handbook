import { SCENARIOS } from "../scenarios.mjs";

export function renderInsight() {
  const data = SCENARIOS.insight;
  return `<main class="app-view insight-screen" data-screen="insight">
    <header class="app-view__header"><div><p class="eyebrow">小宇的成长洞察</p><h1>最近的一条小线索</h1></div><button class="icon-button" aria-label="返回首页" data-action="GO_BACK">${arrow()}</button></header>
    <section class="insight-card" aria-label="成长洞察详情">
      <div class="evidence-meta"><span><b>证据类型</b>${data.evidenceType}</span><span><b>时间范围</b>${data.timeRange}</span></div>
      <article><p class="section-label">发生了什么</p><p class="key-body">${data.happened}</p></article>
      <article><p class="section-label">看见了什么</p><p class="key-body">${data.seen}</p></article>
      <article class="accompany-block"><p class="section-label">可以怎样陪</p><p class="key-body">${data.accompany}</p></article>
      <p class="privacy-note">这里展示的是去隐私后的成长证据摘要。</p>
      <button class="button button--primary" data-action="NAVIGATE" data-screen="agent">和鳄鱼爸爸聊聊 ${arrow()}</button>
    </section>
  </main>`;
}

const arrow = () => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
