import styles from "../../styles/components/werewolf/userinfo.module.scss";
import { useState } from "react";
import HideoutIcon from "../hideout/hideouticon";

// 人狼用

const getIconImgUrl = (userNo: number, userIconUrl: string) => {
	if (userIconUrl) {
		return userIconUrl;
	}
	return "/images/icon/icon" + String(userNo) + ".jpg";
};

const getRollImgUrl = (rollType: number) => {
	let url = null;

	switch (rollType) {
		case 1:
			url = "/images/hideout/swat.png";
			break;
		case 2:
			url = "/images/hideout/terrorist.png";
			break;
	}
	return url;
};

type UserInfoProps = {
	user: any;
	ownFlg: boolean;
	userColor: string;
	changeIcon: (string) => void;
	voting: (string) => void;
	discuttionAction: (string) => void;
	turn: number;
};

export default function UserInfo(props: UserInfoProps) {
	const [infoFlg, setInfoFlg] = useState(false);

	const divStyles = {
		borderColor: props.userColor,
		color: props.userColor,
	};
	const divTurnStyles = {
		borderColor: props.userColor,
		color: props.userColor,
		backgroundColor: "rgb(229,245,228)",
	};

	return (
		<div
			className={`${styles.main}`}
			style={props.user.turnFlg ? divTurnStyles : divStyles}
		>
			{props.ownFlg && <span className={styles.you}>YOU!</span>}
			<div className={styles.icon}>
				{props.ownFlg ? (
					<HideoutIcon
						changeIcon={props.changeIcon}
						mainIconSrc={getIconImgUrl(
							props.user.userNo,
							props.user.userIconUrl
						)}
					/>
				) : (
					<div className={styles.imgdiv}>
						<img
							src={getIconImgUrl(props.user.userNo, props.user.userIconUrl)}
							alt="アイコン"
						/>
					</div>
				)}
				<div className={styles.content}>
					<div className={styles.text}>
						<label>{props.user.userName}</label>
					</div>
				</div>
			</div>
		</div>
	);
}
