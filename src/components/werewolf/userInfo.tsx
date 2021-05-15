import styles from "../../styles/components/werewolf/userinfo.module.scss";
import { useState } from "react";
import HideoutIcon from "../hideout/hideouticon";
import { WerewolfUser, WerewolfRoll } from "../../type/werewolf";
import RollCard from "./rollcard";
import CircleBtn from "../button/circlebtn";

// 人狼用

const getIconImgUrl = (userNo: number, userIconUrl: string) => {
	if (userIconUrl) {
		return userIconUrl;
	}
	return "/images/icon/icon0.jpg";
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
	playerName: string;
	user: WerewolfUser;
	ownFlg: boolean;
	userColor: string;
	changeIcon: (string) => void;
	setModalRoll: (WerewolfRoll) => void;
	userAction: (string) => void;
	turn: number;
	playerActionName: string;
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
		<div className={`${styles.main}`} style={divStyles}>
			{props.ownFlg && <span className={styles.you}>YOU</span>}
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

			{props.playerActionName && !props.ownFlg && (
				<div className={styles.btn}>
					<CircleBtn
						onClickFnc={() => props.userAction(props.user.userName)}
						value={props.playerActionName}
						size={50}
					/>
				</div>
			)}
			{props.user.roll && (
				<div
					className={`${styles.rollcard} ${
						props.user.roll.punishmentFlg && styles.punishment
					}`}
				>
					{props.ownFlg ||
					props.user.roll.openTargetUsernameList.includes(props.playerName) ||
					props.user.roll.openFlg ? (
						<RollCard
							size={100}
							roll={props.user.roll}
							fontSize={2}
							modalView={() => {
								props.setModalRoll(props.user.roll);
							}}
						/>
					) : (
						<div className={styles.back}>
							<img src="/images/werewolf/back.png" alt="シークレット" />
						</div>
					)}
					{props.user.roll.punishmentFlg && (
						<div className={`${styles.back} ${styles.punishmentimgdiv}`}>
							<img src="/images/werewolf/punishment.png" alt="処刑" />
						</div>
					)}
				</div>
			)}
		</div>
	);
}
