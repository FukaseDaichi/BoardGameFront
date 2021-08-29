import React from 'react';
import styles from '../../styles/components/fakeartist/userinfoshort.module.scss';
import { FakeArtistUser } from '../../type/fakeartist';

type UserInfoShortProps = {
    gameTime: number;
    turn: number;
    user: FakeArtistUser;
    playerData: FakeArtistUser;
    changeIcon: (string: string) => void;
    vote: (userName: string) => void;
    roomRemove: (userName: string) => void;
};

export default function UserInfoShort(props: UserInfoShortProps): JSX.Element {
    const tebanFlg = props.gameTime === 1 && props.user.drawFlg;
    const unviewFlg = props.gameTime === 1 && !props.user.drawFlg;
    const ownFlg = props.user.userName === props.playerData.userName;

    const voteFlg =
        props.gameTime === 3 && props.playerData.votingAbleFlg && !ownFlg;

    return (
        <div
            className={`${styles.userinfoshort} ${tebanFlg && styles.turn} ${
                unviewFlg && styles.unview
            } ${voteFlg && styles.vote}`}
        >
            {ownFlg && <p className={styles.you}>YOU</p>}
            <div
                className={styles.icon}
                onClick={() => {
                    if (voteFlg) {
                        props.vote(props.user.userName);
                    }
                }}
            >
                <img src={props.user.userIconUrl} alt="アイコン" />
            </div>
            <p className={styles.name}>{props.user.userName}</p>
        </div>
    );
}
