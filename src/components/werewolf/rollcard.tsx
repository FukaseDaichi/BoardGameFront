import styles from "../../styles/components/werewolf/rollcard.module.scss";
import { WerewolfRoll } from "../../type/werewolf";
import { SystemConst } from "../../const/next.config";

type RollCardProps = {
  roll: WerewolfRoll;
  size: number;
  modalView: () => void;
};

export default function RollCard(props: RollCardProps) {
  const rollStyle = {
    width: props.size + "px",
    height: props.size + "px",
    border: `3px solid ${SystemConst.TEAM_COLOR_LIST[props.roll.teamNo]}`,
  };

  return (
    <div
      className={styles.rollcard}
      style={rollStyle}
      onClick={props.modalView}
    >
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
