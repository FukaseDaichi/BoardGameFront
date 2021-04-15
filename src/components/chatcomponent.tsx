import styles from "../styles/components/chatcomponent.module.scss";
import { useEffect, useState } from "react";
import { useInteractJS } from "./hooks";

const getIconImgUrl = (userNo: number, userIconUrl: string) => {
	if (userIconUrl) {
		return userIconUrl;
	}
	return "/images/icon/icon" + String(userNo) + ".jpg";
};

type ChatComponentProps = {
	chatList: Array<any>;
	chat: (message: string) => void;
};

export default function ChatComponent(props: ChatComponentProps) {
	// メッセージ送信
	const sendMessage = () => {
		const messageDom = document.getElementById(
			"chat-message"
		) as HTMLInputElement;
		props.chat(messageDom.value);
		messageDom.value = "";
		const messageFirld = document.getElementById("chat-firld");
		messageFirld.scrollTop = messageFirld.scrollHeight;
	};

	const interact = useInteractJS();
	const [closeFlg, setCloseflg] = useState(false);

	const changeClose = () => {
		setCloseflg(!closeFlg);
	};

	useEffect(() => {});
	return (
		<div
			className={`${styles["chat-area"]} ${closeFlg ? styles.closed : ""}`}
			draggable="true"
			ref={interact.ref}
			style={{
				...interact.style,
				height: closeFlg ? "30px" : "400px",
				width: closeFlg ? "130px" : "300px",
			}}
		>
			<div className={styles["chat-header"]}>
				<span onClick={changeClose}>　　</span>
			</div>
			<div className={styles["chat-firld"]} id="chat-firld">
				<div className={styles.chat}>
					<div className={styles.chat}>
						<div className={styles["icon-area"]}>
							<div className={styles.icon}>
								<img src="/images/icon/icon1.jpg" />
							</div>
							<div className={styles.name}>名前</div>
						</div>
					</div>
					<div className={styles.message}>
						つぶやきああああああああああああああああああああああああああああああああああああああああああ
					</div>
				</div>
				<div className={styles.chat}>
					<div className={styles.chat}>
						<div className={styles["icon-area"]}>
							<div className={styles.icon}>
								<img src="/images/icon/icon1.jpg" />
							</div>
							<div className={styles.name}>名前aaaaaaaaaaaaaaaaaaaaaa</div>
						</div>
					</div>
					<div className={styles.message}>
						つぶやきああああああああああああああああああああああああああああああああああああああああああ
					</div>
				</div>
				<div className={styles.chat}>
					<div className={styles["icon-area"]}>
						<div className={styles.icon}>
							<img src="/images/icon/icon1.jpg" />
						</div>
						<div className={styles.name}>名前</div>
					</div>
					<div className={styles.message}>つぶやきあああ</div>
				</div>

				{props.chatList.map((chatEntity, index: number) => {
					return (
						<div className={styles.chat} key={index}>
							<div className={styles["icon-area"]}>
								<div className={styles.icon}>
									<img
										src={getIconImgUrl(
											chatEntity.user.userNo,
											chatEntity.user.userIconUrl
										)}
										alt="iconImg"
									/>
								</div>
								<div className={styles.name}>{chatEntity.user.userName}</div>
							</div>
							<div className={styles.message}>{chatEntity.message}</div>
						</div>
					);
				})}
			</div>
			<div className={styles["chat-input"]}>
				<input
					type="text"
					placeholder="MESSAGE"
					maxLength={100}
					id="chat-message"
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							console.log("エンター発火");
							sendMessage();
						}
					}}
				/>
				<button onClick={sendMessage}>send</button>
			</div>
		</div>
	);
}
