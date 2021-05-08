import styles from "../../styles/components/werewolf/modalrollcard.module.scss";
import { useEffect } from "react";
import { WerewolfRoll } from "../../type/werewolf";
import { SystemConst } from "../../const/next.config";

type ModalRollCardProps = {
  roll: WerewolfRoll;
};

const view = () => {
  document.querySelector("body").classList.add("modal_active");
};

const unView = () => {
  document.querySelector("body").classList.remove("modal_active");
};

export default function RollCard(props: ModalRollCardProps) {
  const rollStyle = {
    border: `3px solid ${SystemConst.TEAM_COLOR_LIST[props.roll.teamNo]}`,
  };

  useEffect(() => {
    view();
    return () => unView();
  }, []);

  return (
    <div className={styles.rollcard} style={rollStyle}>
      <div
        className={styles.imgdiv}
        style={{
          backgroundImage: `url(/images/werewolf/roll/${props.roll.rollNo}.jpg)`,
        }}
      >
        <div className={styles.rollname}>{props.roll.name}</div>
      </div>
    </div>
  );
}
