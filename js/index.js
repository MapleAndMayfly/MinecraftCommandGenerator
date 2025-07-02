import { init } from "./init.js";

init();

document.addEventListener('DOMContentLoaded', () => {
  // Listener for give button
  const btnGive = document.getElementById('btn-give');
  if (btnGive) {
    btnGive.addEventListener('click', () => {
      window.location.href = '../pages/give.html'; // 跳转到give页面
    });
  }

  // Listener for locate button
  const btnLocate = document.getElementById('btn-locate');
  if (btnLocate) {
    btnLocate.addEventListener('click', () => {
      window.location.href = '../pages/locate.html'; // 跳转到locate页面
    });
  }
});