import styles from "../../styles/components/button/smallbtn.module.scss";

type SmallbtnProps = {
  value: string;
  onClickFnc: () => void;
};
export default function SmallBtn(props: SmallbtnProps) {
  return (
    <button className={styles.btn} onClick={props.onClickFnc}>
      {props.value}
    </button>
  );
}
