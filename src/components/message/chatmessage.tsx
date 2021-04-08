import styles from "../../styles/components/message/chatmessage.module.scss";

type ChatMessageProps = {
	value: string;
	type: string;
};

export default function ChatMessage(props: ChatMessageProps) {
	return (
		<div className={styles.chatmessage}>
			<div className="container">
				<div className={`${styles.message} ${styles.new}`}>
					<span className={styles.title}>INFO</span>
					<p>{props.value}</p>
				</div>
			</div>
		</div>
	);
}
