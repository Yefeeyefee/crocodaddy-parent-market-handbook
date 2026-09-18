import { SCENARIOS } from "../scenarios.mjs";

const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;

export function renderChildProfile() {
  const profile = SCENARIOS.parentProfile;
  return `<main class="app-view child-profile-screen" data-screen="child-profile">
    <header class="app-view__header"><div><p class="eyebrow">孩子与设备</p><h1>孩子资料</h1></div><button class="icon-button" aria-label="返回上一页" data-action="GO_BACK">${icon("M15 18 9 12l6-6")}</button></header>
    <section class="child-profile-hero"><span class="family-avatar">${profile.childInitial}</span><div><p class="summary-label">当前孩子</p><h2>${profile.childName} · ${profile.childAge} 岁</h2><div class="profile-tags">${profile.interests.map((interest) => `<span>${interest}</span>`).join("")}<span>${profile.temperament}</span></div></div></section>
    <section class="profile-detail-card"><p class="section-label">学习画像</p><div class="profile-detail-row"><span>兴趣</span><strong>${profile.interests.join(" · ")}</strong></div><div class="profile-detail-row"><span>性格线索</span><strong>${profile.temperament}</strong></div><div class="profile-detail-row"><span>学习偏好</span><strong>${profile.learningPreference}</strong></div></section>
    <section class="profile-detail-card profile-device-card"><div class="device-icon">${icon("M5 4h14v16H5zM9 17h6")}</div><div><p class="section-label">孩子端设备</p><h2>${profile.device}</h2><p>${profile.deviceStatus} · 会员与课程状态自动同步</p></div></section>
    <div class="profile-edit-note"><strong>资料会影响定制课程</strong><span>年龄、兴趣和学习偏好发生变化时，可从设置里更新。</span></div>
  </main>`;
}
