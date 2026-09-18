import { createAppController } from "./app-controller.mjs?v=20260918-3";

const root = document.querySelector("#app");
const reviewRoot = document.querySelector("#review-panel");
const controller = createAppController({ root, reviewRoot });
document.addEventListener("click", controller.handleAction);
document.addEventListener("change", controller.handleAction);
document.addEventListener("submit", controller.handleAction);
controller.mount();
export const dispatch = controller.dispatch;
export const handleAction = controller.handleAction;
