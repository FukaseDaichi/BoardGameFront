import styles from "../styles/components/modal.module.scss";

const buttonClick = (e) => {
	console.log(e.target.id);
	const btnId = e.target.id;
	document.getElementById(styles.modal_container).removeAttribute("class");
	document.getElementById(styles.modal_container).classList.add(styles[btnId]);
	document.querySelector("body").classList.add(styles.modal_active);
};
const modalClick = () => {
	document.getElementById(styles.modal_container).classList.add(styles.out);
	document.querySelector("body").classList.remove(styles.modal_active);
};

type ModalProps = {
	value: string;
	type: string;
};

export default function FirstPost() {
	return (
		<div className={styles.modal}>
			<div id={styles.modal_container} onClick={modalClick}>
				<div className={styles.modal_background}>
					<div className={styles.modal}>
						<h2>I'm a Modal</h2>
						<p>Hear me roar.ああああああああああああああああ</p>
						<svg
							className={styles.modal_svg}
							xmlns="http://www.w3.org/2000/svg"
							width="100%"
							height="100%"
							preserveAspectRatio="none"
						>
							<rect
								x="0"
								y="0"
								fill="none"
								width="226"
								height="162"
								rx="3"
								ry="3"
							></rect>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
}
