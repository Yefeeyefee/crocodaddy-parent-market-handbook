import { SCENARIOS } from "../scenarios.mjs";

const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;

export function renderParentGrowth() {
  const data = SCENARIOS.parentGrowth;
  const progress = Math.round((data.points / data.target) * 100);
  return `<main class="app-view parent-growth-screen" data-screen="parent-growth">
    <header class="app-view__header"><div><p class="eyebrow">家长成长</p><h1>我的成长等级</h1></div><button class="icon-button" aria-label="返回我的" data-action="GO_BACK">${icon("M15 18 9 12l6-6")}</button></header>
    <section class="parent-growth-hero" aria-label="当前家长等级"><div class="parent-growth-level"><span>${data.level}</span><small>${data.stage}</small></div><div><p class="summary-label">当前等级</p><h2>${data.title}</h2><p class="growth-period">评估周期 · ${data.period}</p></div><div class="growth-points"><strong>${data.points}</strong><span>/ ${data.target} 成长值</span></div><div class="family-progress family-progress--light" aria-label="距离下一级还差 ${data.remaining} 成长值"><span style="width: ${progress}%"></span></div><div class="parent-growth-meta"><span>本月 +${data.monthlyChange}</span><span>距离 L4 还差 ${data.remaining}</span></div></section>
    <section class="growth-compare-card"><p class="section-label">同阶段参考</p><h2>${data.percentileCopy}</h2><p>仅用于帮助你找到下一步，不是家长排行榜。比较范围为已授权、同年龄段且数据充足的匿名家庭。</p></section>
    <section class="growth-dimension-card"><div class="growth-section-heading"><div><p class="section-label">五个成长维度</p><h2>你正在练习什么</h2></div><span class="growth-period">${data.period}</span></div><div class="growth-dimensions">${data.dimensions.map((dimension) => `<article class="growth-dimension"><div class="growth-dimension-heading"><strong>${dimension.label}</strong><span>${dimension.value}</span></div><div class="dimension-bar" aria-label="${dimension.label} ${dimension.value}"><span style="width: ${dimension.value}%"></span></div><p>${dimension.evidence}</p></article>`).join("")}</div></section>
    <section class="growth-next-card"><p class="section-label">下一个小目标</p><h2>${data.nextAction.title}</h2><p>${data.nextAction.body}</p><button class="button button--primary" data-action="NAVIGATE" data-screen="action">${data.nextAction.cta} ${icon("M5 12h14M12 5l7 7-7 7")}</button></section>
    <p class="growth-method-note">成长值来自有效学习、亲子行动、互动回应、复盘调整和持续实践，不代表对家长好坏的评价。</p>
  </main>`;
}
