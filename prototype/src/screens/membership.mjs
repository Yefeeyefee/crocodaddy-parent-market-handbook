import { SCENARIOS } from "../scenarios.mjs";
const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
const labels = { annual: "连续包年", monthly: "连续包月", quarterly: "连续包季" };
const paymentCopy = {
  idle: "准备好后再确认，不会调用真实支付。",
  processing: "正在模拟提交订单，请稍等。",
  success: "模拟支付成功，家庭权益正在同步。",
  cancelled: "本次没有扣款，可重新模拟支付。",
  failed: "这次模拟支付没有完成，金额不会扣除；请稍后再试。",
  syncing: "支付已完成，正在把权益同步到 Android Pad。",
};

export function renderMembership(state = {}) {
  const selected = state.selectedPlan && SCENARIOS.plans[state.selectedPlan] ? state.selectedPlan : "annual";
  const paymentState = paymentCopy[state.paymentState] ? state.paymentState : "idle";
  const planCards = ["annual", "monthly", "quarterly"].map((plan) => {
    const data = SCENARIOS.plans[plan];
    return `<button class="plan-card ${selected === plan ? "plan-card--selected" : ""}" data-action="PLAN_SELECTED" data-plan="${plan}" aria-pressed="${selected === plan}"><span class="plan-name">${labels[plan]}</span><strong>¥${data.price}</strong><span class="plan-detail">${data.parentFullAccess ? "家长端全部功能" : "家长端基础功能"}</span></button>`;
  }).join("");
  const planName = labels[selected];
  const planPrice = SCENARIOS.plans[selected].price;
  const isProcessing = paymentState === "processing";
  const isNavigate = paymentState === "success" || paymentState === "syncing";
  const actionLabel = paymentState === "success" ? "查看家庭权益" : paymentState === "syncing" ? "查看同步状态" : `模拟支付 ¥${planPrice}`;
  const action = isNavigate ? `data-action="NAVIGATE" data-screen="family"` : `data-action="PAYMENT_START" data-plan="${selected}"`;
  const disabled = isProcessing || (!isNavigate && !state.termsAccepted) ? "disabled" : "";
  return `<main class="app-view membership-screen" data-screen="membership"><header class="app-view__header"><div><p class="eyebrow">家庭会员</p><h1>陪孩子成长，也陪你做更好的家长</h1></div><button class="icon-button" aria-label="返回家庭" data-action="GO_BACK">${icon("M15 18 9 12l6-6")}</button></header>
    <p class="key-body membership-lead">订阅后，孩子端会员会自动同步到同一个家庭账户。</p><section class="plans" aria-label="选择订阅周期">${planCards}</section>
    <label class="agreement"><input type="checkbox" data-action="TERMS_TOGGLED" ${state.termsAccepted === true ? "checked" : ""} />我已阅读并同意自动续费会员服务协议</label><button class="button button--primary payment-button" ${action} ${disabled}>${actionLabel} ${icon("M5 12h14M12 5l7 7-7 7")}</button>
    <section class="payment-feedback payment-feedback--${paymentState}" role="status"><strong>${paymentState === "idle" ? "支付状态" : `支付${paymentState === "success" ? "完成" : "反馈"}`}</strong><div class="payment-plan">当前方案：${planName} · ¥${planPrice}</div><p class="key-body">${paymentCopy[paymentState]}</p>${paymentState === "failed" || paymentState === "cancelled" ? `<button class="button button--quiet" data-action="PAYMENT_START" data-plan="${selected}" ${state.termsAccepted === true ? "" : "disabled"}>重新模拟支付</button>` : ""}</section>
    <p class="membership-fact">套餐为连续订阅，价格与所选周期一致；支付成功后家庭账户统一刷新权益。</p></main>`;
}
