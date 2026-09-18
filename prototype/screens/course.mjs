import { SCENARIOS } from "../scenarios.mjs";

const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
const arrow = () => icon("M5 12h14M12 5l7 7-7 7");
const play = () => icon("M8 5v14l11-7Z");
const pause = () => icon("M8 6v12M16 6v12");

function allLessons() {
  return SCENARIOS.course.weeks.flatMap((week) => week.lessons);
}

function courseArt(art = "starlight", compact = false) {
  return `<div class="course-art course-art--${art} ${compact ? "course-art--compact" : ""}" aria-hidden="true"><span class="course-art__glow"></span><span class="course-art__orb"></span><span class="course-art__line course-art__line--one"></span><span class="course-art__line course-art__line--two"></span><span class="course-art__dot course-art__dot--one"></span><span class="course-art__dot course-art__dot--two"></span><span class="course-art__label">${art === "starlight" ? "星光" : art === "shadow" ? "影子" : art === "map" ? "问题" : art === "moon" ? "月相" : art === "capsule" ? "声音" : "共创"}</span></div>`;
}

function lessonRow(lesson, completed = false) {
  return `<button class="course-lesson-row" data-action="COURSE_LESSON_OPEN" data-lesson-id="${lesson.id}"><span class="lesson-number">${lesson.number}</span>${courseArt(lesson.art, true)}<span class="lesson-copy"><strong>${lesson.title}</strong><span>${lesson.mentor} · ${lesson.duration} · 配图</span></span><span class="lesson-state" aria-hidden="true">${completed && lesson.id === "starlight" ? "已听" : arrow()}</span></button>`;
}

export function renderCourse(state = {}) {
  const data = SCENARIOS.course;
  return `<main class="app-view course-screen" data-screen="course">
    <header class="app-view__header"><div><p class="eyebrow">${data.month} · 小宇的专属安排</p><h1>本月定制课</h1></div><button class="icon-button" aria-label="返回首页" data-action="GO_BACK">${icon("M15 18 9 12l6-6")}</button></header>
    <section class="course-hero" aria-labelledby="course-title"><div class="course-hero-copy"><span class="course-kicker">${data.stats[0]} · ${data.stats[1]}</span><h2 id="course-title">${data.title}</h2><p>${data.subtitle}</p><div class="course-stat-row">${data.stats.map((stat) => `<span>${stat}</span>`).join("")}</div></div>${courseArt("starlight")}</section>
    <section class="course-profile" aria-label="课程定制依据"><div><p class="section-label">为什么是这套课</p><p class="key-body">${data.reason}</p></div><div class="profile-tags">${data.profileTags.map((tag) => `<span>${tag}</span>`).join("")}</div></section>
    <div class="course-format-note">${icon("M12 3v18M3 12h18")}<span><strong>音频为主，配图跟着听</strong> 每节 6–10 分钟，家长可以先预听，再决定什么时候和孩子一起听。</span></div>
    <section class="course-plan" aria-label="四周课程安排">${data.weeks.map((week) => `<section class="course-week"><div class="week-heading"><div><span class="week-label">${week.label}</span><h2>${week.title}</h2></div><span class="week-focus">${week.focus}</span></div><div class="course-lesson-list">${week.lessons.map((lesson) => lessonRow(lesson, state.courseCompleted)).join("")}</div></section>`).join("")}</section>
    <p class="course-privacy-note">课程只使用家长授权的成长摘要和偏好，不展示孩子的对话原文。</p>
  </main>`;
}

export function renderCourseLesson(state = {}) {
  const lesson = allLessons().find((item) => item.id === state.courseLessonId) || allLessons()[0];
  const playing = state.coursePlaying === true;
  const completed = state.courseCompleted === true;
  const status = completed ? "已记下这次听课" : playing ? `正在播放 · 01:24 / ${lesson.duration}` : "准备好后，按一下开始";
  return `<main class="app-view course-lesson-screen" data-screen="course-lesson">
    <header class="app-view__header"><div><p class="eyebrow">${lesson.number} · ${lesson.mentor}</p><h1>音频课</h1></div><button class="icon-button" aria-label="返回本月定制课" data-action="GO_BACK">${icon("M15 18 9 12l6-6")}</button></header>
    <section class="lesson-hero" aria-labelledby="lesson-title">${courseArt(lesson.art)}<div><span class="lesson-duration">${lesson.duration} · 配图同步</span><h2 id="lesson-title">${lesson.title}</h2><p>${status}</p></div></section>
    <section class="audio-player" aria-label="音频播放控制"><div class="audio-progress"><span style="width: ${playing || completed ? "28%" : "0%"}"></span></div><div class="audio-time"><span>${playing || completed ? "01:24" : "00:00"}</span><span>${lesson.duration}</span></div><button class="play-button" data-action="COURSE_PLAY_TOGGLED" aria-label="${playing ? "暂停播放" : "开始播放"}" aria-pressed="${playing}">${playing ? pause() : play()}<span>${playing ? "暂停播放" : "开始播放"}</span></button></section>
    <section class="lesson-visual-card"><p class="section-label">配图提示</p><div class="lesson-visual-inner">${courseArt(lesson.art, true)}<div><strong>${lesson.visual}</strong><p>听到关键问题时，可以和孩子一起指一指、猜一猜。</p></div></div></section>
    <section class="lesson-companion-card"><p class="section-label">家长陪伴提示</p><h2>先听孩子的猜想，再补充答案</h2><p class="key-body">不需要考孩子记住了什么，只要问一句：“你刚才最想继续知道哪一件事？”</p></section>
    <button class="button button--primary lesson-done-button" data-action="COURSE_COMPLETED">${completed ? "已完成这节课" : "听完了，记下这次发现"} ${arrow()}</button>
    <p class="course-player-note">这是原型音频播放状态，不连接真实音频文件。</p>
  </main>`;
}
