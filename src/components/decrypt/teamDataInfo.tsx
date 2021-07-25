import styles from "../../styles/components/decrypt/teamdata.module.scss";
import { useEffect } from "react";
import { DecryptUser, TeamData } from "../../type/decrypt";

type TeamDataProps = {
  userList: Array<DecryptUser>;
  leftTeam: TeamData;
  rightTeam: TeamData;
  turn: number;
  playerData: DecryptUser;
  gameTime: number;
};

export default function TeamDataInfo(props: TeamDataProps) {
  return (
    <div className={styles.teamdatainfo}>
      <div className={styles.teamdata}>
        <h2>ブラック</h2>
        <div>
          {props.userList
            .filter((value: DecryptUser) => {
              return value.teamNo === 1;
            })
            .map((user: DecryptUser) => {
              return <div>{user.userName}</div>;
            })}
        </div>
      </div>
      <div className={styles.centerarea}>
        <h2>フリーエージェント</h2>
        <div>
          {props.userList
            .filter((value: DecryptUser) => {
              return value.teamNo === 0;
            })
            .map((user: DecryptUser) => {
              return <div>{user.userName}</div>;
            })}
        </div>
      </div>
      <div className={styles.teamdata}>
        <h2>ホワイト</h2>
      </div>
    </div>
  );
}
