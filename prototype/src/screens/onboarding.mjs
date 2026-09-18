const arrowIcon = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

export function renderLogin(state = {}) {
  const codeSent = state.codeSent === true;
  return `<section class="onboarding onboarding--login" data-onboarding="login" aria-labelledby="login-title">
    <p class="eyebrow">CROCODADDY · 家长端</p>
    <h2 id="login-title">从了解小宇开始</h2>
    <p class="key-body">登录后，你会看到适合家长阅读的成长摘要。</p>
    <form class="onboarding-form" data-action="PHONE_LOGIN">
      <label for="parent-phone">家长手机号</label>
      <input id="parent-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="请输入手机号" />
      <label for="verification-code">验证码</label>
      <div class="verification-row"><input id="verification-code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code" placeholder="请输入验证码" /><button class="button button--quiet" type="button" data-action="SEND_CODE" ${codeSent ? "disabled" : ""}>${codeSent ? "已发送（演示）" : "获取验证码"}</button></div>
      ${codeSent ? `<p class="form-hint code-status" role="status" aria-live="polite">验证码已发送（演示），不会调用真实短信。</p>` : ""}
      <p class="form-hint" data-association="phone-auto">孩子端也使用同一个家长手机号登录。验证后将按同一手机号自动关联已有孩子档案，无需配对或确认设备。</p>
      <button class="button button--primary onboarding-submit" type="submit">登录并继续 ${arrowIcon}</button>
    </form>
  </section>`;
}

export function renderPrivacy() {
  return `<section class="onboarding onboarding--privacy" data-onboarding="privacy" aria-labelledby="privacy-title">
    <p class="eyebrow">登录完成 · 先了解隐私边界</p>
    <h2 id="privacy-title">家长和孩子，各自拥有安全空间</h2>
    <p class="key-body">我们只把适合家长阅读的成长线索整理给你，不展示双方的咨询原文。</p>
    <div class="privacy-list" aria-label="隐私说明">
      <div class="privacy-item"><span class="privacy-mark" aria-hidden="true">✓</span><p><strong>家长看不到孩子聊天原文</strong><br />你看到的是经过整理的成长摘要和陪伴建议。</p></div>
      <div class="privacy-item"><span class="privacy-mark" aria-hidden="true">✓</span><p><strong>孩子也看不到家长咨询</strong><br />你和鳄鱼爸爸的咨询只属于家长空间。</p></div>
    </div>
    <button class="button button--primary onboarding-submit" data-action="CONSENT_ACCEPTED">我了解，进入首页 ${arrowIcon}</button>
  </section>`;
}
