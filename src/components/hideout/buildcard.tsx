import styles from "../../styles/components/hideout/buildcard.module.scss";

export default function BuildCard() {
	return (
		<div className={styles.buildcard}>
			<div className={styles.front}></div>
			<div className={styles.back}></div>
		</div>
	);
}
