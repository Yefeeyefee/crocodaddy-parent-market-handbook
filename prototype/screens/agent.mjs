import { SCENARIOS } from "../scenarios.mjs";

const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;

export function renderAgent(state = {}) {
  const data = SCENARIOS.agent.example;
  const quota = state.parentFullAccess ? "不限次" : `每月可用 ${Number.isFinite(state.agentQuotaRemaining) ? state.agentQuotaRemaining : 0} 次`;
  return `<main class="app-view agent-screen" data-screen="agent">
    <header class="agent-header"><img src="./assets/crocodaddy-bust.png" alt="鳄鱼爸爸" /><div><p class="eyebrow">家长专属咨询</p><h1>鳄鱼爸爸</h1><span class="agent-online">在线 · 只看成长证据摘要</span></div></header>
    <div class="quota-card"><span>${state.parentFullAccess ? "包年家庭会员" : "基础家庭会员"}</span><strong>${quota}</strong></div>
    <p class="privacy-note">家长端只接收去隐私后的证据摘要，不共享聊天原文。</p><div class="agent-composer" data-composer-state="${state.voiceListening ? "listening" : "idle"}"><h2>问问鳄鱼爸爸</h2><div class="composer-controls"><button class="icon-button voice-button" aria-label="语音输入" data-action="VOICE_TOGGLE">${icon("M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM6 12a6 6 0 0 0 12 0M12 18v3M8 21h8")}</button><textarea aria-label="给鳄鱼爸爸发消息" placeholder="继续问鳄鱼爸爸…"></textarea><button class="icon-button send-button" aria-label="发送消息" data-action="AGENT_SEND">${icon("M5 12h14M12 5l7 7-7 7")}</button></div><span class="composer-status" role="status" aria-live="polite">${state.voiceListening ? "正在聆听" : state.agentMessageSent ? "已收到，鳄鱼爸爸会据此继续陪你想" : ""}</span></div><section class="agent-thread" aria-label="鳄鱼爸爸咨询示例">
      <div class="parent-question"><span>你的问题</span><p class="key-body">${data.question}</p></div>
      <article class="agent-reply"><div class="reply-title">可以先顺着他的好奇心来聊</div><p class="key-body">别急着讲道理，先让他自己说出猜想，再一起寻找答案。</p><div class="evidence-block"><b>为什么这样建议</b><p>${data.evidence}</p></div><div class="suggestion-block"><b>具体建议</b><p>${data.suggestion}</p></div><div class="say-block"><b>家长可以直接说的话</b><p>${data.question.replace("最近总在追问睡觉和时间，我该怎么陪他聊？", "如果身体一整晚都不休息，你猜第二天会发生什么？")}</p></div></article>
      <div class="agent-action-preview"><div><b>今晚可以试一试</b><span>约 3 分钟 · 在家</span></div><p>睡前让他猜一猜身体会做什么。</p><button class="button button--primary" data-action="ACTION_SAVED">保存为行动 ${icon("M5 12h14M12 5l7 7-7 7")}</button></div>
    </section>
  </main>`;
}
