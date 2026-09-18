import { SCREENS } from "./state-machine.mjs";

export const SCREEN_LABELS = Object.freeze({
  login: "登录",
  privacy: "隐私说明",
  home: "首页",
  insight: "成长洞察",
  agent: "鳄鱼爸爸",
  activity: "最近 7 天成长",
  action: "行动建议",
  weekend: "周末建议",
  course: "本月定制课",
  "course-lesson": "音频课",
  notifications: "通知",
  family: "我的",
  membership: "会员方案",
  "parent-growth": "家长成长",
  "child-profile": "孩子资料",
  settings: "设置",
  "account-security": "账号与安全",
  "notification-settings": "通知与活动建议",
  "privacy-settings": "隐私与授权",
  "help-feedback": "帮助与反馈",
});

const HOME_REVIEW_OPTIONS = [
  ["initializing", "正在准备", "正在整理最近 7 天的授权摘要，暂时不下结论。"],
  ["empty", "暂无新摘要", "最近 7 天暂时没有新的成长线索可展示。"],
  ["ready", "数据已就绪", "最近 7 天已有可展示的正向成长线索。"],
  ["stale", "沿用上次摘要", "暂时没有新的同步结果，继续展示上次安全内容。"],
  ["locked", "需要开通权益", "当前成长摘要需要有效会员权益后才能查看。"],
  ["error", "同步失败", "本次同步没有完成，但会保留安全缓存和恢复入口。"],
];

const ACTIVITY_REVIEW_OPTIONS = [
  ["initializing", "正在加载", "正在整理最近 7 天的活动记录。"],
  ["empty", "暂无可展示活动", "最近 7 天暂时没有达到展示条件的正向活动。"],
  ["ready", "数据已就绪", "最近 7 天已有可以轻量展示的活动数据。"],
  ["stale", "暂时显示上次数据", "新的活动数据还没有同步完成，先保留上次内容。"],
  ["error", "暂时无法同步", "活动数据暂时无法更新，页面应保留清晰的恢复入口。"],
];

const PAYMENT_REVIEW_OPTIONS = [
  ["idle", "尚未发起支付", "家长还没有发起本次会员支付。"],
  ["processing", "支付处理中", "支付请求已经发出，暂时不能重复点击支付。"],
  ["success", "支付已完成", "支付成功，下一步是确认家庭权益已经生效。"],
  ["cancelled", "已取消支付", "家长主动结束了支付，本次不会扣款。"],
  ["failed", "支付未完成", "支付没有完成，需要给出原因和重新尝试入口。"],
  ["syncing", "权益同步中", "支付已完成，家庭权益正在同步到孩子端和家长端。"],
];

const COURSE_REVIEW_OPTIONS = [
  ["not-started", "尚未开始", "课程已打开，但家长或孩子还没有开始播放。"],
  ["playing", "正在播放", "音频正在播放，配图与当前音频段保持同步。"],
  ["completed", "已经完成", "本节音频已经完成，允许留下这次学习记录。"],
];

const REVIEW_OPTIONS = Object.freeze({
  home: HOME_REVIEW_OPTIONS,
  activity: ACTIVITY_REVIEW_OPTIONS,
  payment: PAYMENT_REVIEW_OPTIONS,
  course: COURSE_REVIEW_OPTIONS,
});

function option([value, label, description]) {
  return Object.freeze({ value, label, description });
}

export function getReviewStateOptions(kind) {
  return (REVIEW_OPTIONS[kind] || []).map(option);
}

const STATUS_DOCS = {
  home: {
    initializing: { label: "正在准备", tone: "waiting", description: "正在整理最近 7 天的授权摘要，暂时不下结论。", development: ["保留页面骨架和明确的准备中提示，不展示假数据。"], acceptance: ["页面不会白屏，家长能知道稍后可以重新查看。"] },
    empty: { label: "暂无新摘要", tone: "neutral", description: "最近 7 天暂时没有新的成长线索可展示。", development: ["用轻量空态说明没有新线索，不用 0 分、负面标签或虚构进度。"], acceptance: ["周一打开也能正常理解，不因为没有数据而显示空白。"] },
    ready: { label: "数据已就绪", tone: "positive", description: "最近 7 天已有可展示的正向成长线索。", development: ["只展示一条核心线索、一个真实亮点和一个轻量下一步。"], acceptance: ["家长在 30 秒内能知道最近发生了什么，并能进入二级详情。"] },
    stale: { label: "沿用上次摘要", tone: "attention", description: "暂时没有新的同步结果，继续展示上次安全内容。", development: ["明确标注内容时间，不把旧内容伪装成今天刚发生。"], acceptance: ["旧摘要仍可读，同时提供重新同步入口。"] },
    locked: { label: "需要开通权益", tone: "attention", description: "当前成长摘要需要有效会员权益后才能查看。", development: ["用价值说明和会员入口承接，不泄露受限数据。"], acceptance: ["点击恢复入口进入会员方案，不出现失效的假按钮。"] },
    error: { label: "同步失败", tone: "attention", description: "本次同步没有完成，但会保留安全缓存和恢复入口。", development: ["保留可用缓存，说明这次更新失败，并提供再次尝试。"], acceptance: ["错误态仍然可操作，不丢失家长已经看到的安全内容。"] },
  },
  activity: {
    initializing: { label: "正在加载", tone: "waiting", description: "正在整理最近 7 天的活动记录。", development: ["加载阶段使用稳定骨架，不提前渲染统计结果。"], acceptance: ["加载状态有明确文案，且不会阻塞返回首页。"] },
    empty: { label: "暂无可展示活动", tone: "neutral", description: "最近 7 天暂时没有达到展示条件的正向活动。", development: ["只展示温和的空态和下一步建议，不制造落差感。"], acceptance: ["空态不出现负面判断、百分比或虚构趋势。"] },
    ready: { label: "数据已就绪", tone: "positive", description: "最近 7 天已有可以轻量展示的活动数据。", development: ["只保留最核心的正向数据：参与、完成和最近一次亮点。"], acceptance: ["数据可追溯到最近 7 天，且每项都能说明对家长有什么用。"] },
    stale: { label: "暂时显示上次数据", tone: "attention", description: "新的活动数据还没有同步完成，先保留上次内容。", development: ["展示上次数据的时间，避免让家长误以为是最新记录。"], acceptance: ["保留内容可读，并提供明确的重新同步路径。"] },
    error: { label: "暂时无法同步", tone: "attention", description: "活动数据暂时无法更新，页面应保留清晰的恢复入口。", development: ["错误态仍展示安全缓存或原因说明，不把同步失败变成空白页。"], acceptance: ["家长能分辨‘暂无活动’和‘暂时无法同步’。"] },
  },
  membership: Object.fromEntries(PAYMENT_REVIEW_OPTIONS.map(([value, label, description]) => [value, { label, tone: value === "success" ? "positive" : value === "processing" || value === "syncing" ? "waiting" : value === "failed" || value === "cancelled" ? "attention" : "neutral", description, development: ["支付状态必须对应明确的按钮、权益提示和下一步。"], acceptance: ["状态切换后，家长能知道是否扣款、权益是否生效以及下一步做什么。"] }])),
  "course-lesson": Object.fromEntries(COURSE_REVIEW_OPTIONS.map(([value, label, description]) => [value, { label, tone: value === "completed" ? "positive" : value === "playing" ? "waiting" : "neutral", description, development: ["音频、播放进度、配图和完成记录必须保持同一节课的状态。"], acceptance: ["播放、暂停和完成后，按钮文案与左侧说明保持一致。"] }])),
};

const BASE_DOCS = {
  login: {
    purpose: "让家长用最少步骤进入自己的家庭空间。",
    functionItems: ["输入家长手机号", "获取并提交验证码", "自动关联已有孩子档案"],
    explanationItems: ["家长端与孩子端使用同一个家长手机号，不要求扫码或设备配对。"],
    developmentItems: ["手机号和验证码都要有清晰的校验反馈。"],
    acceptanceItems: ["验证成功后进入隐私说明，不直接跳过授权。"],
  },
  privacy: {
    purpose: "在首次使用前让家长理解信息如何被使用和展示。",
    functionItems: ["阅读双向内容隔离说明", "确认授权范围", "进入家长首页"],
    explanationItems: ["家长只看到经过授权的成长摘要，不看到孩子聊天原文。"],
    developmentItems: ["授权文案必须先于进入首页出现，且可回到隐私设置复查。"],
    acceptanceItems: ["未确认授权时不能进入首页。"],
  },
  home: {
    purpose: "让家长在 30 秒内知道最近 7 天发生了什么、一个真实亮点和下一步怎么陪。",
    functionItems: ["查看最近 7 天成长线索", "打开一条线索的二级详情", "进入鳄鱼爸爸、行动和定制课程"],
    explanationItems: ["首页只保留正向、核心、可行动的信息，不堆叠重复摘要。", "周末建议与定制课程从首页承接，但拥有独立模块。"],
    developmentItems: ["时间范围固定为最近 7 天，不能写成‘本周’。", "不展示孩子聊天原文、排行榜、诊断或未经授权的推断。"],
    acceptanceItems: ["首页首屏信息层级清楚，家长无需理解数据模型即可操作。"],
  },
  insight: {
    purpose: "把首页的一条成长线索展开成可理解、可回应的二级详情。",
    functionItems: ["查看线索来源和最近时间", "理解这个变化为什么值得关注", "进入一次亲子回应或咨询"],
    explanationItems: ["详情解释观察到的行为，不给孩子贴固定标签。"],
    developmentItems: ["所有结论都要能回到授权摘要和明确时间范围。"],
    acceptanceItems: ["详情页比首页更完整，但不引入新的信息边界。"],
  },
  agent: {
    purpose: "让家长可以把孩子的情况、沟通和陪伴问题交给鳄鱼爸爸一起理清。",
    functionItems: ["输入问题并获得回应", "使用语音入口", "把建议保存为一次行动"],
    explanationItems: ["鳄鱼爸爸是家长侧的教育陪伴入口，不把孩子原始对话搬到家长端。"],
    developmentItems: ["回应只使用家长授权的摘要和当前对话，不暴露内部评估标签。"],
    acceptanceItems: ["家长能从咨询自然进入行动建议，且保存结果可追踪。"],
  },
  activity: {
    purpose: "只给家长看最近 7 天最核心、偏正向的活动反馈。",
    functionItems: ["查看最近 7 天参与情况", "看到一次代表性亮点", "从活动回到成长线索"],
    explanationItems: ["数据展示的目标是帮助家长理解和鼓励，而不是监控和排名。"],
    developmentItems: ["默认只保留参与、完成、最近亮点等少量指标。"],
    acceptanceItems: ["每个指标都能用普通语言解释，不需要研发或运营翻译。"],
  },
  action: {
    purpose: "把洞察转成家长今天就能做的一件轻量小事。",
    functionItems: ["查看为家庭定制的行动", "标记已完成", "反馈是否适合当前家庭"],
    explanationItems: ["行动强调陪伴和回应，不把家长变成监督员。"],
    developmentItems: ["每次只突出一个下一步，完成后保留反馈入口。"],
    acceptanceItems: ["保存和反馈后，页面给出清晰确认，不重复堆卡片。"],
  },
  weekend: {
    purpose: "根据孩子兴趣和所在城市，给家长一个可执行的周末安排。",
    functionItems: ["查看推荐活动", "了解适合孩子的原因", "提醒、换一个或标记不适合"],
    explanationItems: ["推荐要同时说明去哪儿、花多久和为什么适合，不只给一个地点名。"],
    developmentItems: ["地点、时间和孩子兴趣需要来自可解释的推荐依据。"],
    acceptanceItems: ["家长能在一个页面完成判断，不需要再查一堆信息。"],
  },
  course: {
    purpose: "按孩子年龄、性格、爱好给出一套每月定制的音频主课程。",
    functionItems: ["浏览月度课程安排", "查看课程定制依据", "打开一节音频课"],
    explanationItems: ["课程以音频为主，配图帮助家长和孩子一起听、指认和讨论。"],
    developmentItems: ["月度课程要标注年龄、兴趣和性格依据，且每节课都有时长。"],
    acceptanceItems: ["课程列表能让家长理解为什么是这套课，并能顺畅进入播放页。"],
  },
  "course-lesson": {
    purpose: "让家长在一个安静、明确的页面里播放一节定制音频课。",
    functionItems: ["开始或暂停音频", "查看配图提示", "标记本节完成"],
    explanationItems: ["配图不是装饰，而是帮助家长在关键问题出现时与孩子一起指一指、猜一猜。"],
    developmentItems: ["播放进度、配图提示和完成动作必须对应当前课程，不串课。"],
    acceptanceItems: ["未开始、播放中、已完成三种状态都能被看懂。"],
  },
  notifications: {
    purpose: "让家长只接收到与家庭成长有关、值得查看的提醒。",
    functionItems: ["查看成长摘要提醒", "查看课程和行动提醒", "进入对应模块"],
    explanationItems: ["通知要帮助家长抓住重要变化，不制造焦虑或连续打扰。"],
    developmentItems: ["通知类型和安静时段设置要能回到设置页管理。"],
    acceptanceItems: ["每条通知都有明确来源和去向，不出现孤立消息。"],
  },
  family: {
    purpose: "作为家长的个人空间，集中展示家长成长、孩子资料和当前套餐。",
    functionItems: ["查看家长头像、昵称和成长等级", "查看孩子信息和当前套餐", "进入独立设置页"],
    explanationItems: ["‘我的’负责查看和进入，不把密码、隐私、通知开关堆在同一页。"],
    developmentItems: ["个人信息只展示头像和昵称，设置项通过二级页面承载。"],
    acceptanceItems: ["家长能分清个人成长、孩子资料、会员权益和设置四类入口。"],
  },
  membership: {
    purpose: "让家长理解会员能带来什么，并安全完成套餐选择和支付。",
    functionItems: ["比较月、季、年套餐", "确认自动续费协议", "查看支付和权益同步结果"],
    explanationItems: ["支付页必须明确金额、套餐、是否扣款以及权益何时生效。"],
    developmentItems: ["支付按钮、协议勾选和结果反馈必须和当前支付情况一致。"],
    acceptanceItems: ["成功、处理中、取消、失败、同步中都能说明下一步。"],
  },
  "parent-growth": {
    purpose: "让家长知道自己正在成长，以及下一步可以怎样精进。",
    functionItems: ["查看家长等级和成长值", "了解等级依据", "进入家长课程或行动"],
    explanationItems: ["等级鼓励家长持续学习和实践，不是给家庭贴好坏标签。"],
    developmentItems: ["成长值来源需要可解释：课程、行动反馈、孩子侧授权满意度等。"],
    acceptanceItems: ["家长能看懂当前等级、进步空间和可执行的升级路径。"],
  },
  "child-profile": {
    purpose: "让家长维护用于课程和行动定制的孩子基础信息。",
    functionItems: ["查看年龄和兴趣", "维护性格与偏好", "查看信息如何影响推荐"],
    explanationItems: ["资料用于定制课程和建议，不用来给孩子排名或诊断。"],
    developmentItems: ["字段修改要有明确保存反馈，敏感信息不要在列表里过度展开。"],
    acceptanceItems: ["家长修改后能知道哪些课程和行动会受到影响。"],
  },
  settings: {
    purpose: "作为所有账户、通知、隐私和帮助设置的二级入口。",
    functionItems: ["进入账号与安全", "管理通知与活动建议", "管理隐私与授权、帮助与反馈"],
    explanationItems: ["设置集中在独立页面，避免把操作开关堆在‘我的’首页。"],
    developmentItems: ["每个设置入口必须进入对应二级页，并保留返回路径。"],
    acceptanceItems: ["家长能预期每项设置会影响什么，不需要阅读代码或内部术语。"],
  },
  "account-security": {
    purpose: "让家长管理登录身份和账户安全。",
    functionItems: ["查看绑定手机号", "修改安全信息", "处理登录异常"],
    explanationItems: ["只展示必要的账户信息，敏感值需要脱敏。"],
    developmentItems: ["任何修改都要有二次确认和成功反馈。"],
    acceptanceItems: ["返回设置页后，修改结果仍然清晰可见。"],
  },
  "notification-settings": {
    purpose: "让家长决定哪些提醒可以到达，以及什么时候保持安静。",
    functionItems: ["开关成长摘要提醒", "开关活动建议", "设置安静时段"],
    explanationItems: ["通知设置只影响提醒，不会删除成长数据或改变课程。"],
    developmentItems: ["每个开关要说明影响范围，保存后立即反馈。"],
    acceptanceItems: ["开关状态与通知中心的实际行为保持一致。"],
  },
  "privacy-settings": {
    purpose: "让家长复查和调整孩子信息授权范围。",
    functionItems: ["查看摘要授权范围", "管理定位和数据使用授权", "查看内容隔离说明"],
    explanationItems: ["家长看到的是摘要和用途说明，不会在此处看到孩子聊天原文。"],
    developmentItems: ["每项授权都要有用途、影响和可撤回方式。"],
    acceptanceItems: ["授权变化后，首页、课程和行动建议能按新范围工作。"],
  },
  "help-feedback": {
    purpose: "给家长一个找到答案和反馈问题的入口。",
    functionItems: ["查看常见问题", "反馈使用问题", "联系支持"],
    explanationItems: ["帮助内容用家长能懂的语言，不把内部系统状态直接甩给用户。"],
    developmentItems: ["反馈要能带上当前模块和状态，便于研发定位。"],
    acceptanceItems: ["提交反馈后有明确回执，不要求家长重复描述上下文。"],
  },
};

const FALLBACK_DOC = {
  purpose: "让家长完成当前模块里的一个清晰任务。",
  functionItems: ["查看当前信息", "执行当前页面提供的操作", "回到上一级或主导航"],
  explanationItems: ["页面内容应保持轻量、可理解，并遵守家长端的信息边界。"],
  developmentItems: ["交互、状态和返回路径都要有明确反馈。"],
  acceptanceItems: ["首次使用的家长不需要理解内部术语也能完成任务。"],
};

function courseState(state) {
  if (state.courseCompleted === true) return "completed";
  if (state.coursePlaying === true) return "playing";
  return "not-started";
}

function statusFor(screen, state) {
  const value = screen === "home" ? state.homeState : screen === "activity" ? state.activityState : screen === "membership" ? state.paymentState : screen === "course-lesson" ? courseState(state) : "default";
  const status = STATUS_DOCS[screen]?.[value];
  if (status) return { value, ...status };
  return { value: "default", label: "当前页面", tone: "neutral", description: "正在查看当前模块的默认内容。", development: [], acceptance: [] };
}

export function getProductDoc(state = {}) {
  const screen = SCREENS.includes(state.screen) ? state.screen : "home";
  const base = BASE_DOCS[screen] || FALLBACK_DOC;
  const status = statusFor(screen, state);
  return {
    moduleLabel: SCREEN_LABELS[screen] || "家长端模块",
    stateValue: status.value,
    stateLabel: status.label,
    stateTone: status.tone,
    stateDescription: status.description,
    purpose: base.purpose,
    functionItems: [...base.functionItems],
    explanationItems: [...base.explanationItems],
    developmentItems: [...base.developmentItems, ...status.development],
    acceptanceItems: [...base.acceptanceItems, ...status.acceptance],
  };
}
