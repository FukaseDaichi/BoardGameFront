import styles from "../styles/components/countdownclock.module.scss";

export default function CountdownClock() {
  return (
    <div className={styles.clock}>
      <div className={styles.wrapper}>
        <div className={styles["time-part-wrapper"]}>
          <div
            className={`${styles["time-part"]} ${styles.minutes} ${styles.tens}`}
          >
            <div className={styles["digit-wrapper"]}>
              <span className={styles.digit}>0</span>
              <span className={styles.digit}>5</span>
              <span className={styles.digit}>4</span>
              <span className={styles.digit}>3</span>
              <span className={styles.digit}>2</span>
              <span className={styles.digit}>1</span>
              <span className={styles.digit}>0</span>
            </div>
          </div>
          <div
            className={`${styles["time-part"]} ${styles.minutes} ${styles.ones}`}
          >
            <div className={styles["digit-wrapper"]}>
              <span className={styles.digit}>0</span>
              <span className={styles.digit}>9</span>
              <span className={styles.digit}>8</span>
              <span className={styles.digit}>7</span>
              <span className={styles.digit}>6</span>
              <span className={styles.digit}>5</span>
              <span className={styles.digit}>4</span>
              <span className={styles.digit}>3</span>
              <span className={styles.digit}>2</span>
              <span className={styles.digit}>1</span>
              <span className={styles.digit}>0</span>
            </div>
          </div>
        </div>
        <div className={styles["time-part-wrapper"]}>
          <div
            className={`${styles["time-part"]} ${styles.seconds} ${styles.tens}`}
          >
            <div className={styles["digit-wrapper"]}>
              <span className={styles.digit}>0</span>
              <span className={styles.digit}>5</span>
              <span className={styles.digit}>4</span>
              <span className={styles.digit}>3</span>
              <span className={styles.digit}>2</span>
              <span className={styles.digit}>1</span>
              <span className={styles.digit}>0</span>
            </div>
          </div>
          <div
            className={`${styles["time-part"]} ${styles.seconds} ${styles.ones}`}
          >
            <div className={styles["digit-wrapper"]}>
              <span className={styles.digit}>0</span>
              <span className={styles.digit}>9</span>
              <span className={styles.digit}>8</span>
              <span className={styles.digit}>7</span>
              <span className={styles.digit}>6</span>
              <span className={styles.digit}>5</span>
              <span className={styles.digit}>4</span>
              <span className={styles.digit}>3</span>
              <span className={styles.digit}>2</span>
              <span className={styles.digit}>1</span>
              <span className={styles.digit}>0</span>
            </div>
          </div>
        </div>
        <div className={styles["time-part-wrapper"]}>
          <div
            className={`${styles["time-part"]} ${styles.hundredths} ${styles.tens}`}
          >
            <div className={styles["digit-wrapper"]}>
              <span className={styles.digit}>0</span>
              <span className={styles.digit}>9</span>
              <span className={styles.digit}>8</span>
              <span className={styles.digit}>7</span>
              <span className={styles.digit}>6</span>
              <span className={styles.digit}>5</span>
              <span className={styles.digit}>4</span>
              <span className={styles.digit}>3</span>
              <span className={styles.digit}>2</span>
              <span className={styles.digit}>1</span>
              <span className={styles.digit}>0</span>
            </div>
          </div>
          <div
            className={`${styles["time-part"]} ${styles.hundredths} ${styles.ones}`}
          ></div>
        </div>
      </div>
    </div>
  );
}
