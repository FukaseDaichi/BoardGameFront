import { TimeBombUser, LeadCards } from "../../type";
import styles from "../../styles/components/timebomb/userinfo.module.scss";

const getImgUrl = (cardType: number) => {
	let url = null;

	switch (cardType) {
		case 1:
			url = "/images/release.png";
			break;
		case 2:
			url = "/images/bomb.png";
			break;
		case 3:
			url = "/images/common.png";
			break;
	}
	return url;
};

const getIconImgUrl = (userNo: number) => {
	let url = null;

	return "/images/icon" + String(userNo) + ".jpeg";
};

type UserInfoProps = {
	user: TimeBombUser;
	cardlist: Array<LeadCards>;
	ownFlg: boolean;
	playfnc: (cardIndex: number) => void;
};

export default function UserInfo(userInfoProps: UserInfoProps) {
	return (
		<div
			className={`${styles.main} ${userInfoProps.user.turnFlg && styles.turn} ${
				userInfoProps.ownFlg && styles.own
			}`}
		>
			<div className={styles.icon}>
				<div>
					<img src={getIconImgUrl(userInfoProps.user.userNo)} alt="アイコン" />
				</div>
				<label>{userInfoProps.user.userName}</label>
			</div>
			<div className={`row ${styles.handcatd}`}>
				{userInfoProps.cardlist.map((value: LeadCards, index: number) => {
					const id: string =
						(userInfoProps.user.userNo - 1) * 5 + index + "_cards";
					return (
						<div
							key={index}
							onClick={(event) => {
								const targetDom: HTMLElement = event.target as HTMLElement;
								const hereDomId: string = targetDom.parentElement.id;
								userInfoProps.playfnc(Number(hereDomId.split("_")[0]));
							}}
							id={id}
							className={value.openFlg ? styles.opend : ""}
						>
							{userInfoProps.ownFlg ? (
								<img
									src={getImgUrl(value.cardType)}
									alt="あなたの裏カード"
									className={styles.gray}
								/>
							) : (
								<img src="/images/back.png" alt="裏カード" />
							)}
							<img src={getImgUrl(value.cardType)} alt="表カード" />
						</div>
					);
				})}
			</div>
		</div>
	);
}
