import styles from "../../styles/components/werewolf/modalrollcard.module.scss";
import { useEffect } from "react";
import { WerewolfRoll } from "../../type/werewolf";
import { SystemConst } from "../../const/next.config";

type ModalRollCardProps = {
  roll: WerewolfRoll;
  hidden: () => void;
};

const view = () => {
  document.querySelector("body").classList.add("modal_active_overflow_view");
};

export default function ModalRollCard(props: ModalRollCardProps) {
  const rollStyle = {
    border: `3px solid ${SystemConst.TEAM_COLOR_LIST[props.roll.teamNo]}`,
  };

  const unView = () => {
    props.hidden();
    const dom = document.getElementById("modal-roll-area");
    if (dom) {
      dom.classList.add(styles["flip-out-hor-top"]);
    }
    document
      .querySelector("body")
      .classList.remove("modal_active_overflow_view");
  };

  useEffect(() => {
    view();
    return () =>
      document.querySelector("body").classList.remove("modal_active");
  }, []);

  return (
    <div className={styles.modal}>
      <div
        style={{
          backgroundColor: SystemConst.TEAM_COLOR_LIST[props.roll.teamNo],
        }}
        onClick={unView}
        id="modal-roll-area"
      >
        <div
          className={styles.imgdiv}
          style={{
            backgroundImage: `url(/images/werewolf/roll/${props.roll.rollNo}.jpg)`,
          }}
        >
          <div className={styles.rollname}>{props.roll.name}</div>
        </div>

        <div className={styles.info}>
          <div className={styles.winDescription}>
            <span>勝利条件 </span>
            <span> {props.roll.winDescription}</span>
          </div>
          <div>{props.roll.description}</div>
        </div>
      </div>
    </div>
  );
}
