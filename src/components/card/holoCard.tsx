import styles from "../../styles/components/card/holocard.module.scss";

export default function HoloCard() {
  const cardStyle = {
    backgroundImage: "url(/images/bommer.png)",
    width: "350px",
    height: "484px",
    borderRadius: "65px",
  };
  return (
    <div className={styles.holocard}>
      <div className={`${styles.card}`} style={cardStyle}></div>
    </div>
  );
}
