import { SCENARIOS } from "../scenarios.mjs";

const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
const planLabels = { annual: "连续包年", monthly: "连续包月", quarterly: "连续包季" };
const planCycles = { annual: "年", monthly: "月", quarterly: "季" };

export function renderFamily(state = {}) {
  const profile = SCENARIOS.parentProfile;
  const growth = SCENARIOS.parentGrowth;
  const selectedPlan = SCENARIOS.plans[state.selectedPlan] ? state.selectedPlan : "annual";
  const plan = SCENARIOS.plans[selectedPlan];
  const membershipStatus = state.paymentState === "syncing" ? "权益同步中" : state.paymentState === "success" ? "已开通 · 原型状态" : `当前方案 · ${planLabels[selectedPlan]}`;
  const progress = Math.round((growth.points / growth.target) * 100);
  return `<main class="app-view family-screen" data-screen="family">
    <header class="app-view__header family-header"><div class="family-title-block"><p class="eyebrow">家庭账户</p><h1>我的</h1></div><button class="icon-button" aria-label="打开设置" data-action="NAVIGATE" data-screen="settings">${icon("M4 7h16M7 4v3M17 4v3M5 10h14M6 14h4M6 18h7")}</button></header>
    <button class="family-growth-card" data-action="NAVIGATE" data-screen="parent-growth" aria-label="查看家长成长详情">
      <div class="family-growth-top"><div class="family-growth-identity"><span class="parent-avatar" aria-label="家长头像">${profile.parentInitial}</span><div><div class="family-parent-name-row"><strong>${profile.parentNickname}</strong><small>家长账号</small></div><h2>${growth.level} · ${growth.title}</h2></div></div><span class="family-level-mark"><strong>${growth.points}</strong><small>成长值</small></span></div>
      <p class="family-growth-lead">正在把“知道怎么陪”变成“真的陪起来”。</p>
      <div class="family-progress" aria-label="成长值 ${growth.points} / ${growth.target}"><span style="width: ${progress}%"></span></div>
      <div class="family-growth-meta"><span>成长值 ${growth.points} / ${growth.target}</span><span>本月 +${growth.monthlyChange}</span><span>距离 L4 还差 ${growth.remaining}</span><span>超过 ${growth.percentile}% 同阶段家庭</span></div>
      <span class="family-card-link">查看成长详情 ${icon("M5 12h14M12 5l7 7-7 7")}</span>
    </button>
    <button class="family-profile-card" data-action="NAVIGATE" data-screen="child-profile" aria-label="查看孩子资料">
      <div class="family-profile-top"><span class="family-avatar">${profile.childInitial}</span><div><span class="summary-label">孩子资料</span><h2>${profile.childName} · ${profile.childAge} 岁</h2><div class="profile-tags">${profile.interests.map((interest) => `<span>${interest}</span>`).join("")}<span>${profile.temperament}</span></div></div></div>
      <div class="family-profile-meta"><span>${profile.device} · ${profile.deviceStatus}</span><span>${profile.learningPreference}</span></div>
      <span class="family-card-link">查看孩子资料 ${icon("M5 12h14M12 5l7 7-7 7")}</span>
    </button>
    <button class="family-membership-card" data-action="NAVIGATE" data-screen="membership" aria-label="管理当前套餐">
      <div class="membership-card-top"><div><span class="summary-label">当前套餐</span><h2>${planLabels[selectedPlan]}</h2></div><strong>¥${plan.price}<small> / ${planCycles[selectedPlan]}</small></strong></div>
      <div class="membership-card-meta"><span>${plan.parentFullAccess ? "家长端全部功能" : "家长端基础功能"}</span><span>${membershipStatus}</span></div>
      <span class="family-card-link">管理套餐 ${icon("M5 12h14M12 5l7 7-7 7")}</span>
    </button>
  </main>`;
}
