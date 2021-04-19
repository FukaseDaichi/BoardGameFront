import styles from "../../styles/components/hideout/userinfo.module.scss";
import { useState } from "react";
// ハイドアウト用

const getBuildImgUrl = (cardType: number) => {
	let url = null;

	switch (cardType) {
		case 1:
			url = "/images/hideout/hideout.png";
			break;
		case 2:
			url = "/images/hideout/dummy.png";
			break;
		case 3:
			url = "/images/hideout/bomb.png";
			break;
	}
	return url;
};

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
};

export default function UserInfo(props: UserInfoProps) {
	const [infoFlg, setInfoFlg] = useState(false);

	return (
		<div className={`${styles.main}`}>
			<div className={styles.icon}>
				<div className={styles.imgdiv}>
					<img
						src={getIconImgUrl(props.user.userNo, props.user.userIconUrl)}
						alt="アイコン"
					/>
				</div>
				<div className={styles.content}>
					<div className={styles.text}>
						<label>{props.user.userName}</label>
					</div>

					<div className={styles.btnarea}>
						<div className={styles.btn}>
							<input type="checkbox" id="chk1" />
							<label
								htmlFor="chk1"
								onClick={() => {
									const checkDom = document.getElementById(
										"chk1"
									) as HTMLInputElement;

									setInfoFlg(!checkDom.checked);
								}}
							>
								<div className={styles.hamberger}>
									<span></span>
									<span></span>
									<span></span>
								</div>
							</label>
						</div>
					</div>
				</div>
			</div>
			{props.user.turnFlg && (
				<div className={styles.turn}>
					<img src={"/images/hasami.png"} alt="手番" />
				</div>
			)}
			{infoFlg && (
				<div
					className={styles.card}
					onClick={() => {
						const checkDom = document.getElementById(
							"chk1"
						) as HTMLInputElement;
						checkDom.checked = false;
						setInfoFlg(false);
					}}
				>
					<div className={styles["card-roll"]}>
						<img src={getRollImgUrl(props.user.userRoleNo)} alt="役職" />
					</div>
				</div>
			)}
			{props.user.buildingCard && (
				<div className={styles.build}>
					<img
						src={getBuildImgUrl(props.user.buildingCard.catdType)}
						alt="建物"
					/>
				</div>
			)}
		</div>
	);
}
