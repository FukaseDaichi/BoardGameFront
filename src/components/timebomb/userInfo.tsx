import { TimeBombUser, LeadCards } from "../../type";
import styles from "../../styles/components/timebomb/userinfo.module.scss";
import Modal from "../../components/modal";
import { useState } from "react";

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

const getRollImgUrl = (rollType: number) => {
  let url = null;

  switch (rollType) {
    case 1:
      url = "/images/timepolice.png";
      break;
    case 2:
      url = "/images/bommer.png";
      break;
  }
  return url;
};

type UserInfoProps = {
  user: TimeBombUser;
  cardlist: Array<LeadCards>;
  ownFlg: boolean;
  round: number;
  playfnc: (cardIndex: number) => void;
};

export default function UserInfo(userInfoProps: UserInfoProps) {
  const [infoFlg, setInfoFlg] = useState(false);
  return (
    <div
      className={`${styles.main} ${userInfoProps.user.turnFlg && styles.turn} ${
        userInfoProps.ownFlg && styles.own
      }`}
    >
      <div className={styles.icon}>
        <div className={styles.imgdiv}>
          <img src={getIconImgUrl(userInfoProps.user.userNo)} alt="アイコン" />
        </div>
        <div className={styles.content}>
          <div className={styles.text}>
            <label>{userInfoProps.user.userName}</label>
            {userInfoProps.ownFlg && <span>YOU!</span>}
          </div>

          {userInfoProps.ownFlg && userInfoProps.user.userRoleNo > 0 && (
            <div className={styles.btnarea}>
              <div className={styles.btn}>
                <input type="checkbox" id="chk1" />
                <label
                  htmlFor="chk1"
                  onClick={() => {
                    setInfoFlg(!infoFlg);
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
          )}
        </div>
      </div>
      {userInfoProps.user.turnFlg && (
        <div className={styles.turn}>
          <img src={"/images/hasami.png"} alt="手番" />
        </div>
      )}
      {userInfoProps.ownFlg && infoFlg && (
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
            <img
              src={getRollImgUrl(userInfoProps.user.userRoleNo)}
              alt="役職"
            />
          </div>
          {/* <div className={styles["card-icon"]}>
            <img
              src={getIconImgUrl(userInfoProps.user.userNo)}
              alt="アイコン"
            />
          </div>
          <div className={styles["card-info"]}>
            <label>{userInfoProps.user.userName}</label>
            <p></p>
          </div> */}
        </div>
      )}

      <div className={`row ${styles.handcatd}`}>
        {userInfoProps.cardlist.map((value: LeadCards, index: number) => {
          const id: string =
            (userInfoProps.user.userNo - 1) * (6 - userInfoProps.round) +
            index +
            "_cards";
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
