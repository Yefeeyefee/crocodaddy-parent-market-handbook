import { SCENARIOS } from "../scenarios.mjs";

const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;

export function renderAgent(state = {}) {
  const data = SCENARIOS.agent.example;
  const quota = state.parentFullAccess ? "不限次" : `每月可用 ${Number.isFinite(state.agentQuotaRemaining) ? state.agentQuotaRemaining : 0} 次`;
  const followUp = data.question.replace("最近总在追问睡觉和时间，我该怎么陪他聊？", "如果身体一整晚都不休息，你猜第二天会发生什么？");
  return `<main class="app-view agent-chat-screen" data-screen="agent">
    <header class="agent-chat-header"><button class="icon-button agent-chat-back" aria-label="返回首页" data-action="GO_BACK">${icon("M15 18 9 12l6-6")}</button><div class="agent-chat-identity"><img src="./assets/crocodaddy-bust.png" alt="鳄鱼爸爸" /><div><h1>鳄鱼爸爸</h1><span class="agent-online">在线</span></div></div><span class="chat-quota" aria-label="咨询额度">${quota}</span></header>
    <section class="agent-thread chat-thread" aria-label="与鳄鱼爸爸的聊天">
      <p class="chat-date">今天</p>
      <div class="chat-row chat-row--user"><div class="chat-bubble chat-bubble--user"><p>${data.question}</p></div></div>
      <div class="chat-row chat-row--assistant"><img class="chat-avatar" src="./assets/crocodaddy-bust.png" alt="" /><div class="chat-bubble chat-bubble--assistant"><p>可以先顺着他的好奇心来聊。</p><p>${data.evidence}</p></div></div>
      <div class="chat-row chat-row--assistant"><img class="chat-avatar" src="./assets/crocodaddy-bust.png" alt="" /><div class="chat-bubble chat-bubble--assistant"><p>${data.suggestion}</p><p>家长可以这样问：</p><p>${followUp}</p></div></div>
      <div class="chat-row chat-row--assistant"><img class="chat-avatar" src="./assets/crocodaddy-bust.png" alt="" /><div class="chat-bubble chat-bubble--assistant chat-bubble--action"><p><strong>今晚可以试一试</strong> · 约 3 分钟 · 在家</p><p>睡前让他猜一猜身体会做什么。</p><button class="button button--primary chat-action-button" data-action="ACTION_SAVED">保存为行动 ${icon("M5 12h14M12 5l7 7-7 7")}</button></div></div>
    </section>
    <div class="agent-composer" data-composer-state="${state.voiceListening ? "listening" : "idle"}"><h2>问问鳄鱼爸爸</h2><div class="composer-controls"><button class="icon-button voice-button" aria-label="语音输入" data-action="VOICE_TOGGLE">${icon("M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM6 12a6 6 0 0 0 12 0M12 18v3M8 21h8")}</button><textarea aria-label="给鳄鱼爸爸发消息" placeholder="继续问鳄鱼爸爸…"></textarea><button class="icon-button send-button" aria-label="发送消息" data-action="AGENT_SEND">${icon("M5 12h14M12 5l7 7-7 7")}</button></div><span class="composer-status" role="status" aria-live="polite">${state.voiceListening ? "正在聆听" : state.agentMessageSent ? "已收到，鳄鱼爸爸会据此继续陪你想" : ""}</span></div>
  </main>`;
}
