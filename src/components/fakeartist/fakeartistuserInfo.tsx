import React from 'react';
import styles from '../../styles/components/fakeartist/fakeartistuserinfo.module.scss';
import { FakeArtistUser } from '../../type/fakeartist';
import HideoutIcon from '../hideout/hideouticon';
import CircleBtn from '../button/circlebtn';

const getIconImgUrl = (userNo: number, userIconUrl: string) => {
    if (userIconUrl) {
        return userIconUrl;
    }
    return '/images/icon/icon' + String(userNo) + '.jpg';
};

type FakeartistUserInfoProps = {
    gameTime: number;
    turn: number;
    user: FakeArtistUser;
    playerData: FakeArtistUser;
    changeIcon: (string: string) => void;
};

export default function FakeartistUserInfo(
    props: FakeartistUserInfoProps
): JSX.Element {
    const ownFlg = props.user.userName === props.playerData.userName;
    return (
        <div className={styles.userinfo}>
            {ownFlg && <span className={styles.you}>YOU</span>}
            <div className={styles.icon}>
                {props.user.userName === props.playerData.userName ? (
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
                            src={getIconImgUrl(
                                props.user.userNo,
                                props.user.userIconUrl
                            )}
                            alt="アイコン"
                        />
                    </div>
                )}
                <div className={styles.content}>
                    <div className={styles.text}>
                        <label>{props.user.userName}</label>
                    </div>
                </div>
            </div>

            {!ownFlg && (
                <div className={styles.btn}>
                    <CircleBtn
                        onClickFnc={() => alert('test')}
                        value={'投票'}
                        size={50}
                    />
                </div>
            )}
            {props.user.roll && (
                <div
                    className={`${styles.rollcard} ${
                        props.user.punishmentFlg && styles.punishment
                    }`}
                >
                    {ownFlg ? (
                        <img src="/images/werewolf/back.png" alt="役職" />
                    ) : (
                        <div className={styles.back}>
                            <img
                                src="/images/werewolf/back.png"
                                alt="シークレット"
                            />
                        </div>
                    )}
                    {props.user.punishmentFlg && (
                        <div
                            className={`${styles.back} ${styles.punishmentimgdiv}`}
                        >
                            <img
                                src="/images/werewolf/punishment.png"
                                alt="処刑"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
