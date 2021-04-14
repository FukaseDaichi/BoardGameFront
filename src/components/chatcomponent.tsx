import styles from "../styles/components/chatcomponent.module.scss";

export default function ChatComponent() {
	return (
		<div className={styles["chat-area"]} draggable="true">
			<div className={styles["chat-header"]}>
				<span>最小化</span>
			</div>
			<div className={styles["chat-firld"]}>
				<div className={styles.chat}>
					<div className={styles.icon}>
						<img src="/images/icon/icon1.jpg" />
					</div>
					<div className={styles.message}>
						つぶやきああああああああああああああああああああああああああああああああああああああああああ
					</div>
				</div>
				<div className={styles.chat}>
					<div className={styles.icon}>
						<img src="/images/icon/icon1.jpg" />
					</div>
					<div className={styles.message}>
						つぶやきああああああああああああああああああああああああああああああああああああああああああ
					</div>
				</div>
				<div className={styles.chat}>
					<div className={styles.icon}>
						<img src="/images/icon/icon1.jpg" />
					</div>
					<div className={styles.message}>つぶやきあああ</div>
				</div>
			</div>
			<div className={styles["chat-input"]}>
				<input type="text" placeholder="入力" />
				<button>送信</button>
			</div>
		</div>
	);
}
