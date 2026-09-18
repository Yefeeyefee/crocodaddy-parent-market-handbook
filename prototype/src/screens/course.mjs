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

function lessonRow(lesson, { completed = false, currentId = "" } = {}) {
  const current = currentId === lesson.id;
  const stateLabel = current ? "正在看" : completed && lesson.id === "starlight" ? "已听" : arrow();
  return `<button class="course-lesson-row${current ? " course-lesson-row--current" : ""}" data-action="COURSE_LESSON_OPEN" data-lesson-id="${lesson.id}"${current ? ' aria-current="true"' : ""}><span class="lesson-number">${lesson.number}</span>${courseArt(lesson.art, true)}<span class="lesson-copy"><strong>${lesson.title}</strong><span>${lesson.mentor} · ${lesson.duration}</span></span><span class="lesson-state" aria-hidden="true">${stateLabel}</span></button>`;
}

export function renderCourse(state = {}) {
  const data = SCENARIOS.course;
  return `<main class="app-view course-screen" data-screen="course">
    <header class="app-view__header"><div><p class="eyebrow">${data.month} · 小宇的专属安排</p><h1>本月定制课</h1></div><button class="icon-button" aria-label="返回首页" data-action="GO_BACK">${icon("M15 18 9 12l6-6")}</button></header>
    <section class="course-hero" aria-labelledby="course-title"><div class="course-hero-copy"><span class="course-kicker">${data.stats[0]} · ${data.stats[1]}</span><h2 id="course-title">${data.title}</h2><p>${data.subtitle}</p><div class="course-stat-row">${data.stats.map((stat) => `<span>${stat}</span>`).join("")}</div></div>${courseArt("starlight")}</section>
    <section class="course-profile" aria-label="课程定制依据"><div><p class="section-label">为什么是这套课</p><p class="key-body">${data.reason}</p></div><div class="profile-tags">${data.profileTags.map((tag) => `<span>${tag}</span>`).join("")}</div></section>
    <section class="course-plan" aria-label="四周课程安排">${data.weeks.map((week) => `<section class="course-week"><div class="week-heading"><div><span class="week-label">${week.label}</span><h2>${week.title}</h2></div><span class="week-focus">${week.focus}</span></div><div class="course-lesson-list">${week.lessons.map((lesson) => lessonRow(lesson, { completed: state.courseCompleted })).join("")}</div></section>`).join("")}</section>
  </main>`;
}

export function renderCourseLesson(state = {}) {
  const lesson = allLessons().find((item) => item.id === state.courseLessonId) || allLessons()[0];
  const playing = state.coursePlaying === true;
  const completed = state.courseCompleted === true;
  const pageCount = lesson.pageCount || 50;
  const currentPage = completed ? pageCount : playing ? Math.min(12, pageCount) : 1;
  const status = completed ? `已播放完 · 共 ${pageCount} 页课件` : playing ? `正在播放第 ${currentPage} 页 · 01:24 / ${lesson.duration}` : "尚未播放 · 第 1 页";
  return `<main class="app-view course-lesson-screen" data-screen="course-lesson">
    <header class="app-view__header"><div><p class="eyebrow">${lesson.number} · ${lesson.mentor}</p><h1>音频绘本课件</h1></div><button class="icon-button" aria-label="返回本月定制课" data-action="GO_BACK">${icon("M15 18 9 12l6-6")}</button></header>
    <section class="lesson-courseware" aria-labelledby="lesson-title">
      <div class="lesson-slide" data-current-page="${currentPage}" data-page-count="${pageCount}"><div class="lesson-slide__visual">${courseArt(lesson.art)}</div><div class="lesson-slide__meta"><span>课件画面</span><strong>第 ${currentPage} / ${pageCount} 页</strong></div></div>
      <div class="lesson-courseware__copy"><span class="lesson-duration">${lesson.mentor} · ${lesson.duration}</span><h2 id="lesson-title">${lesson.title}</h2><p>${status}</p></div>
      <div class="audio-player" aria-label="旁白播放控制"><div class="audio-player__label"><span>旁白</span><span>${completed ? "已播放完" : playing ? "播放中" : "未播放"}</span></div><div class="audio-progress"><span style="width: ${completed ? "100%" : playing ? "28%" : "0%"}"></span></div><div class="audio-time"><span>${playing || completed ? "01:24" : "00:00"}</span><span>${lesson.duration}</span></div><button class="play-button" data-action="COURSE_PLAY_TOGGLED" aria-label="${playing ? "暂停播放" : "开始播放"}" aria-pressed="${playing}">${playing ? pause() : play()}<span>${playing ? "暂停播放" : "开始播放"}</span></button></div>
    </section>
    <section class="lesson-course-list" aria-label="本月课程列表"><div class="lesson-course-list__header"><div><p class="section-label">本月课程列表</p><h2>继续听哪一节？</h2></div><span>${allLessons().length} 节</span></div><div class="course-lesson-list course-lesson-list--embedded">${SCENARIOS.course.weeks.flatMap((week) => week.lessons).map((item) => lessonRow(item, { completed, currentId: lesson.id })).join("")}</div></section>
  </main>`;
}
