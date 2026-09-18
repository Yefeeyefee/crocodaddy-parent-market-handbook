const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;

export function renderNotifications() {
  return `<main class="app-view notifications-screen" data-screen="notifications">
    <header class="app-view__header"><div><p class="eyebrow">消息中心</p><h1>慢慢看，重要的我会说清楚</h1></div><button class="icon-button" aria-label="返回首页" data-action="GO_BACK">${icon("M15 18 9 12l6-6")}</button></header>
    <section class="notification-summary"><p class="summary-label">本周摘要</p><h2>这周有 3 件事值得看看</h2><p class="key-body">鳄鱼爸爸把小宇的学习亮点整理好了，没有需要立刻处理的事情，慢慢看就好。</p></section>
    <div class="quiet-note">${icon("M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4")}<span><strong>安静时段</strong>默认 21:30–08:00。普通通知会等到第二天再送达。</span></div>
    <section class="notification-list" aria-label="通知列表">
      <article class="notification-card"><span class="notification-kind">普通动态</span><h2>小宇把自己的猜想画下来了</h2><p class="key-body">他在星空主题里先说出想法，再找证据验证。打开首页就能看到这次小进步。</p><time>今天 09:20 · App 内可见</time></article>
      <article class="notification-card notification-card--care"><span class="notification-kind">温柔关心</span><h2>最近几次，他都更早聊到“睡觉”</h2><p class="key-body">可以找一个轻松的时刻，问问他身体休息时会做什么。不用急着下结论，听他讲完就好。</p><time>昨天 18:10 · 可稍后查看</time></article>
    </section>
  </main>`;
}
