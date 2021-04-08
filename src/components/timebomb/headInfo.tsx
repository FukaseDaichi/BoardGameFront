import styles from "../../styles/components/timebomb/headInfo.module.scss";

const successScreen = document.querySelector(".success_screen");
const header = document.querySelector(".success_screen__header");
const toast = document.querySelector(".toast");
const button = document.querySelector(".button") as HTMLButtonElement;

button.addEventListener("click", simulateLoad);
button.addEventListener("touchend", simulateLoad);

function simulateLoad() {
  button.classList.add(styles.button__loading);
  button.disabled = true;
  button.querySelector(styles.span).innerHTML = "Loading...";
  setTimeout(showSuccessScreen, 2000);
}

function showSuccessScreen() {
  button.classList.add(styles.button__hide);
  successScreen.classList.add(styles.success_screen__show);

  setTimeout(() => {
    header.classList.add(styles.success_screen__header__show);
  }, 500);

  setTimeout(() => {
    toast.classList.add(styles.toast__show);
  }, 2000);
}

const Confetti = (function () {
  const confettiContainer = document.querySelector(
    styles.confetti_container
  ) as HTMLElement;

  const animationSpeeds = ["slow", "medium", "fast"];
  const types = ["round", "rectangle"];
  let renderInterval = null;
})();
