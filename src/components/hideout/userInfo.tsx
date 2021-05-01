import styles from "../../styles/components/hideout/userinfo.module.scss";
import { useState } from "react";
import HoloCard from "../../components/card/holoCard";
import HideoutIcon from "./hideouticon";
import BuildCard from "../../components/hideout/buildcard";
import { userInfo } from "node:os";

// ハイドアウト用

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
  userList: Array<any>;
  wait: (number) => void;
};

export default function UserInfo(props: UserInfoProps) {
  const [infoFlg, setInfoFlg] = useState(false);

  const divStyles = {
    borderColor: props.userColor,
    color: props.userColor,
  };
  return (
    <div className={`${styles.main}`} style={divStyles}>
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

          {props.ownFlg && (
            <div className={styles.btnarea}>
              <div
                className={styles.btn}
                style={{ backgroundColor: props.userColor }}
              >
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
          )}
        </div>
      </div>
      {props.user.turnFlg && (
        <div className={styles.turn}>
          <img src={"/images/hasami.png"} alt="手番" />
        </div>
      )}
      {infoFlg && (
        <div
          className={`${styles.card} ${
            props.user.userNo % 2 === 0 ? styles.even : ""
          }`}
          onClick={() => {
            const checkDom = document.getElementById(
              "chk1"
            ) as HTMLInputElement;
            checkDom.checked = false;
            setInfoFlg(false);
          }}
        >
          <div className={styles["card-roll"]}>
            <HoloCard
              width={290}
              height={295}
              imgUrl={getRollImgUrl(props.user.userRoleNo)}
              rareFlg={false}
              borderRadius={39}
            />
          </div>
        </div>
      )}
      {props.user.buildingCard && (
        <BuildCard
          wait={props.wait}
          userList={props.userList}
          buildingCard={props.user.buildingCard}
          waitUserIndexList={props.user.waitUserIndexList}
          ownFlg={props.ownFlg}
        />
      )}
    </div>
  );
}
