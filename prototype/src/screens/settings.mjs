import { SCENARIOS } from "../scenarios.mjs";

const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
const arrow = icon("M5 12h14M12 5l7 7-7 7");
const back = icon("M15 18 9 12l6-6");

function detailHeader(eyebrow, title, label = "返回设置") {
  return `<header class="app-view__header"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1></div><button class="icon-button" aria-label="${label}" data-action="GO_BACK">${back}</button></header>`;
}

function toggleRow({ title, description, enabled, action, label }) {
  return `<div class="settings-toggle-row"><div><strong>${title}</strong><p>${description}</p></div><button class="toggle ${enabled ? "toggle--on" : ""}" role="switch" aria-checked="${enabled}" aria-label="${label}${enabled ? "已开启" : "已关闭"}" data-action="${action}" data-enabled="${enabled ? "false" : "true"}"><span></span></button></div>`;
}

export function renderSettings() {
  const groups = SCENARIOS.settings.groups;
  return `<main class="app-view settings-screen" data-screen="settings">
    ${detailHeader("家庭账户", "设置", "返回我的")}
    <p class="key-body settings-lead">账号、孩子资料和陪伴偏好，都在这里统一管理。</p>
    <div class="settings-groups">${groups.map((group) => `<section class="settings-group"><p class="section-label">${group.label}</p><div class="settings-list">${group.items.map((item) => `<button class="settings-row" data-action="NAVIGATE" data-screen="${item.screen}"><span><strong>${item.title}</strong><small>${item.description}</small></span>${arrow}</button>`).join("")}</div></section>`).join("")}</div>
  </main>`;
}

export function renderAccountSecurity() {
  const phone = SCENARIOS.parentProfile.parentPhone;
  return `<main class="app-view settings-detail-screen" data-screen="account-security">
    ${detailHeader("账号与家庭", "账号与安全")}
    <section class="settings-detail-card"><div class="account-identity"><div class="account-avatar" aria-label="家长头像">${SCENARIOS.parentProfile.parentInitial}</div><div><p class="summary-label">当前家长账号</p><h2>${SCENARIOS.parentProfile.parentNickname}</h2><p>${phone} · 同一手机号用于关联家长端与孩子端。</p></div></div></section>
    <section class="settings-detail-card"><p class="section-label">登录信息</p><div class="settings-info-row"><span>手机号</span><strong>${phone}</strong></div><div class="settings-info-row"><span>登录密码</span><strong>已设置</strong></div><div class="settings-info-row"><span>登录设备</span><strong>本机 · 当前使用</strong></div></section>
    <div class="settings-production-note"><strong>修改账号信息</strong><span>修改手机号或密码时，需要真实验证码和安全校验；原型不伪造修改成功。</span></div>
  </main>`;
}

export function renderNotificationSettings(state = {}) {
  return `<main class="app-view settings-detail-screen" data-screen="notification-settings">
    ${detailHeader("陪伴偏好", "通知与活动建议")}
    <section class="settings-detail-card settings-toggle-card"><p class="section-label">消息提醒</p>${toggleRow({ title: "成长提醒", description: "有新的成长线索或课程反馈时提醒我。", enabled: state.notificationsEnabled === true, action: "NOTIFICATIONS_TOGGLED", label: "成长提醒" })}${toggleRow({ title: "安静时段", description: "21:30–08:00 不发送普通通知。", enabled: state.quietHoursEnabled === true, action: "QUIET_HOURS_TOGGLED", label: "安静时段" })}</section>
    <section class="settings-detail-card settings-toggle-card"><p class="section-label">活动建议</p>${toggleRow({ title: "使用位置推荐活动", description: "只用于判断附近活动，关闭后仍可使用基础建议。", enabled: state.locationEnabled === true, action: "LOCATION_TOGGLED", label: "位置权限" })}<p class="settings-status" role="status">位置权限：${state.locationEnabled === true ? "已开启" : "关闭"}</p></section>
  </main>`;
}

export function renderPrivacySettings() {
  return `<main class="app-view settings-detail-screen" data-screen="privacy-settings">
    ${detailHeader("陪伴偏好", "隐私与授权")}
    <section class="settings-detail-card"><p class="section-label">家长端展示范围</p><h2>只看适合家长阅读的成长摘要</h2><p>孩子聊天原文不会进入家长端；成长摘要会在授权范围内，经过整理后展示。</p></section>
    <section class="settings-detail-card"><p class="section-label">数据权利</p><div class="settings-info-row"><span>授权管理</span><strong>已授权摘要</strong></div><div class="settings-info-row"><span>撤回授权</span><strong>需连接真实账号</strong></div><div class="settings-info-row"><span>导出与删除</span><strong>需连接数据接口</strong></div></section>
    <div class="settings-production-note"><strong>你可以随时调整授权</strong><span>真实版本会在这里提供授权记录、撤回、导出和删除操作。</span></div>
  </main>`;
}

export function renderHelpFeedback() {
  return `<main class="app-view settings-detail-screen" data-screen="help-feedback">
    ${detailHeader("需要帮助", "帮助与反馈")}
    <section class="settings-detail-card"><p class="section-label">常见问题</p><div class="settings-info-row"><span>如何让课程更贴合孩子</span><strong>查看孩子资料</strong></div><div class="settings-info-row"><span>如何使用行动建议</span><strong>进入行动</strong></div><div class="settings-info-row"><span>如何联系鳄鱼爸爸</span><strong>家长端专属咨询</strong></div></section>
    <section class="help-contact-card"><p class="section-label">还想聊聊？</p><h2>把问题交给鳄鱼爸爸</h2><p>关于孩子、课程或亲子沟通，都可以从这里继续问。</p><button class="button button--primary" data-action="NAVIGATE" data-screen="agent">去咨询 ${arrow}</button></section>
    <div class="settings-production-note"><strong>意见反馈</strong><span>真实版本会接入客服和反馈工单；当前原型只展示入口位置。</span></div>
  </main>`;
}
