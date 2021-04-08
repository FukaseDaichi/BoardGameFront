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
	Confetti.render();

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

	function render() {
		renderInterval = setInterval(() => {
			const particle = document.createElement("div") as HTMLElement;

			const particleType = types[Math.floor(Math.random() * types.length)];
			const particleLeft =
				Math.floor(Math.random() * confettiContainer.offsetWidth) + "px";
			const particleAnimation =
				animationSpeeds[Math.floor(Math.random() * animationSpeeds.length)];

			particle.classList.add(
				styles.confetti__particle,
				`confetti__particle__animation_${particleAnimation}`,
				`confetti__particle__${particleType}`
			);
			particle.style.left = particleLeft;
			particle.style.transform = `rotate(${Math.floor(
				Math.random() * 360
			)}deg)`;

			particle.removeTimeout = setTimeout(function () {
				particle.parentNode.removeChild(particle);
			}, 15000);

			confettiContainer.appendChild(particle);
		}, 300);
	}

	return {
		render,
	};
})();
