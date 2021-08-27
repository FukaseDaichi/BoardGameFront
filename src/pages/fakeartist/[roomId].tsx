/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useRouter } from 'next/router';
import SockJsClient from 'react-stomp';
import { SystemConst } from '../../const/next.config';
import Layout from '../../components/layout';
import Head from 'next/head';
import { SocketInfo } from '../../type';
import { useEffect, useState, useCallback } from 'react';
import Chatmessage from '../../components/message/chatmessage';
import ChatComponent from '../../components/chatcomponent';
import styles from '../../styles/components/fakeartist/room.module.scss';
import Router from 'next/router';

import Start from '../../components/timebomb/start';
import Canvas from '../../components/fakeartist/canvas';
import { ArtData, FakeArtistUser } from '../../type/fakeartist';
import FakeartistUserInfo from '../../components/fakeartist/fakeartistuserInfo';

// 接続切れ
const disconnect = () => {
    console.log('接続が切れました');
};

// お絵描きコールバック
const callBackDraw = (artDataArray: Array<ArtData>) => {
    console.log(artDataArray);
    const canvas: HTMLCanvasElement = document.querySelector('#draw-area');
    const context = canvas.getContext('2d');

    context.beginPath();

    for (let i = 0; i < artDataArray.length - 1; i++) {
        console.log(artDataArray[i]);
        console.log(
            artDataArray[i].xparamPotision,
            artDataArray[i].yparamPotision
        );
        context.lineCap = 'round'; // 丸みを帯びた線にする
        context.lineJoin = 'round'; // 丸みを帯びた線にする
        context.lineWidth = artDataArray[i].lineWidth; // 線の太さ
        context.strokeStyle = artDataArray[i].color; // 線の色

        context.moveTo(
            artDataArray[i].xparamPotision,
            artDataArray[i].yparamPotision
        );
        context.lineTo(
            artDataArray[i + 1].xparamPotision,
            artDataArray[i + 1].yparamPotision
        );

        context.stroke();
    }

    context.closePath();
};

export default function FakeArtistRoom(): JSX.Element {
    // roomId取得
    const router = useRouter();
    const { roomId } = router.query;

    const [clientObj, setClientObj] = useState(null);
    const [messageList, setMessageList] = useState([]);
    const [chatList, setChatList] = useState([]);

    // gamedata
    const [userList, setUserLst] = useState([]);
    const [gameTime, setGameTime] = useState(0);
    const [turn, setTurn] = useState(0);
    const [limitTime, setLimitTime] = useState(0);

    // userInfo
    const [playerName, setPlayerName] = useState(null);
    const [playerData, setPlayerData] = useState<FakeArtistUser>(null);

    // view
    const [startFlg, setStartFlg] = useState(false);

    // ルーム入室
    const roomIn = (userName: string) => {
        if (userName === '') {
            return;
        }
        const url = '/app/game-roomin';
        const soketInfo: SocketInfo = {
            status: 100,
            roomId: roomId as string,
            userName: userName,
            message: null,
            obj: null,
        };

        setPlayerName(userName);
        conect(url, soketInfo);
    };

    // アイコン変更
    const changeIcon = useCallback(
        (iconUrl: string) => {
            const url = '/app/game-changeIcon';
            const soketInfo: SocketInfo = {
                status: 650,
                roomId: roomId as string,
                userName: playerName,
                message: null,
                obj: iconUrl,
            };
            conect(url, soketInfo);
        },
        [clientObj, playerName]
    );

    // チャット
    const chat = useCallback(
        (message: string) => {
            if (playerData) {
                const url = '/app/game-chat';
                const soketInfo: SocketInfo = {
                    status: 101,
                    roomId: roomId as string,
                    userName: playerName,
                    message: message,
                    obj: null,
                };
                conect(url, soketInfo);
                setMessageList(messageList.concat(message));
            }
        },
        [playerName, messageList]
    );

    // ゲーム開始
    const init = useCallback(() => {
        const url = '/app/fakeartist-init';
        const soketInfo: SocketInfo = {
            status: 300,
            roomId: roomId as string,
            userName: playerName,
            message: null,
            obj: null,
        };
        conect(url, soketInfo);
    }, [playerName]);

    // お絵描き
    const draw = useCallback(
        (artDataArray: Array<ArtData>) => {
            const url = '/app/fakeartist-drawing';
            const soketInfo: SocketInfo = {
                status: 450,
                roomId: roomId as string,
                userName: playerName,
                message: null,
                obj: artDataArray,
            };
            conect(url, soketInfo);
        },
        [playerName]
    );

    // 投票
    const vote = useCallback(
        (targetUsername: string) => {
            const url = '/app/fakeartist-voting';

            const soketInfo: SocketInfo = {
                status: 500,
                roomId: roomId as string,
                userName: playerName,
                message: null,
                obj: targetUsername,
            };
            conect(url, soketInfo);
        },
        [playerName]
    );

    // 制限時間変更
    const changeLimitTime = useCallback(
        (time: number) => {
            const url = '/app/game-setlimittime';
            const soketInfo: SocketInfo = {
                status: 550,
                roomId: roomId as string,
                userName: null,
                message: null,
                obj: time,
            };
            conect(url, soketInfo);
        },
        [playerName]
    );

    // 議論制限時間超過
    const limittimeDone = useCallback(() => {
        if (gameTime === 2) {
            const url = '/app/game-dooverLimit';
            const soketInfo: SocketInfo = {
                status: 600,
                roomId: roomId as string,
                userName: null,
                message: null,
                obj: turn,
            };
            conect(url, soketInfo);
        }
    }, [turn]);

    const conect = (url: string, soketInfo: SocketInfo) => {
        try {
            clientObj.sendMessage(url, JSON.stringify(soketInfo));
        } catch (e) {
            setMessageList(
                messageList.concat('通信エラー。再度試してください')
            );
        }
    };

    const getMessage = (socketInfo: SocketInfo) => {
        // デバッグ用
        console.log(socketInfo);

        switch (socketInfo.status) {
            case 100: // ルーム入室
                dataSet(socketInfo.obj);
                break;

            case 101: {
                // チャット
                setChatList(socketInfo.obj);
                const messageFirld = document.getElementById('chat-firld');
                messageFirld.scrollTop = messageFirld.scrollHeight;
                break;
            }

            case 200: // 同一ユーザ入室(再入室)
                dataSet(socketInfo.obj);
                setMessageList(() => messageList.concat(socketInfo.message));
                break;

            case 300: // ゲーム開始
                // ゲームスタート
                setStartFlg(true);
                dataSet(socketInfo.obj);
                break;

            case 404: // 例外
                setMessageList(messageList.concat(socketInfo.message));
                break;

            case 450: {
                // お絵描き

                // 別の人の絵を反映
                if (socketInfo.userName !== playerName) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const drawData: Array<any> =
                        socketInfo.obj.artDataStrokeList;
                    callBackDraw(drawData[drawData.length - 1].artDataList);
                }
                dataSet(socketInfo.obj);
                break;
            }
            case 451: // お絵描き（通常）
                break;

            case 500: // 投票
                dataSet(socketInfo.obj);
                break;

            case 550: // 制限時間変更
                setLimitTime(socketInfo.obj);
                break;

            case 600: // 制限時間超過
                dataSet(socketInfo.obj);
                break;

            case 650: // アイコン変更
                setUserLst(socketInfo.obj);
                break;

            case 998: // エラーメッセージ表示(個人)
                if (socketInfo.userName === playerName) {
                    setMessageList(messageList.concat(socketInfo.message));
                }
                break;

            case 999: // エラーメッセージ表示(全員)
                setMessageList(messageList.concat(socketInfo.message));
                break;

            default:
                console.log(socketInfo);
        }
    };

    // データセット
    const dataSet = (obj) => {
        setUserLst(obj.userList);
        setTurn(obj.turn);
        setGameTime(obj.gameTime);
    };

    // スタートフラグの監視
    useEffect(() => {
        if (startFlg) {
            scrollTo(0, 0);
            window.setTimeout(() => {
                setStartFlg(false);
            }, 4000);
        }
    }, [startFlg]);

    // 入室時
    useEffect(() => {
        const userArray = userList.filter((element) => {
            return element.userName === playerName;
        });
        if (userArray.length > 0) {
            const btnDom = document.querySelector('.' + styles.roominbtn);
            if (btnDom.classList.contains(styles.in)) {
                return;
            }
            btnDom.classList.add(styles.in);

            // アイコン初期設定
            if (userArray[0].userIconUrl === null) {
                changeIcon('/images/icon/icon' + userArray[0].userNo + '.jpg');
            }
        }
    }, [userList.length, playerName]);

    // プレイヤーデータ設定
    useEffect(() => {
        const filterNameArray = userList.filter((element) => {
            return element.userName === playerName;
        });
        if (filterNameArray.length > 0) {
            setPlayerData(filterNameArray[0]);
        }
    }, [userList, playerName]);

    return (
        <Layout home={false}>
            <style jsx global>
                {`
                    body {
                        overflow-x: hidden;
                        background-color: #f3f3f3;
                    }

                    body:before {
                        position: fixed;
                        top: 0;
                        left: 0;
                        z-index: -1;
                        width: 100vw;
                        height: 100vh;
                        background: url(/images/decrypt/decryptbackground2.png);
                        -webkit-background-size: 370px;
                        background-size: 370px;
                        background-position: bottom left;
                        background-repeat: no-repeat;
                        opacity: 0.7;
                        content: '';
                    }
                `}
            </style>
            <Head>
                <meta
                    property="og:image"
                    content={
                        SystemConst.Server.SITE_URL +
                        '/images/decrypt/decryptbackground2.png'
                    }
                />
                <meta
                    property="og:title"
                    content="エセ芸術家ニューヨークへ行く"
                />
                <meta
                    property="og:description"
                    content="エセ芸術家ニューヨークへ行く　オンライン"
                />
                <title>エセ芸術家ニューヨークへ行く</title>
            </Head>
            {/* 開始合図 */}
            {startFlg && <Start />}

            {/* メッセージエリア */}
            {messageList.map((value, index) => {
                if (index === messageList.length - 1) {
                    return (
                        <Chatmessage value={value} type="info" key={index} />
                    );
                }
            })}

            <SockJsClient
                url={SystemConst.Server.AP_HOST + SystemConst.Server.ENDPOINT}
                topics={['/topic/' + roomId]}
                ref={(client) => {
                    setClientObj(client);
                }}
                onMessage={(msg) => {
                    getMessage(msg);
                }}
                onDisconnect={disconnect}
            />
            <div className={styles.roominbtn}>
                <p>
                    <label htmlFor="username">Name</label>
                </p>
                <input
                    type="text"
                    id="username"
                    maxLength={20}
                    onKeyPress={(e) => {
                        // enterkey event
                        if (e.key == 'Enter') {
                            e.preventDefault();
                            const usernameDom: HTMLInputElement =
                                document.getElementById(
                                    'username'
                                ) as HTMLInputElement;
                            roomIn(usernameDom.value);
                        }
                    }}
                />
                <button
                    onClick={() => {
                        const usernameDom: HTMLInputElement =
                            document.getElementById(
                                'username'
                            ) as HTMLInputElement;
                        roomIn(usernameDom.value);
                    }}
                >
                    Room IN
                </button>
            </div>
            {playerData && <Canvas drawFnc={draw} />}

            {/* ユーザ情報 */}
            <div className={styles.userList}>
                {playerData &&
                    userList &&
                    userList.map((user: FakeArtistUser, index: number) => {
                        return (
                            <FakeartistUserInfo
                                gameTime={gameTime}
                                playerData={playerData}
                                turn={turn}
                                user={user}
                                key={index}
                                changeIcon={changeIcon}
                            />
                        );
                    })}
            </div>
            {/* 議論中の制限時間 */}
            {playerData && (turn === 0 || turn === 4) && (
                <div className={styles.rollselect}>
                    <div className={styles.title}>議論中の制限時間</div>

                    <div className={styles.limittimeinputarea}>
                        <div onClick={() => changeLimitTime(0)}>
                            <input
                                type="radio"
                                id="limit-time-0"
                                name="limit-time"
                                value="0"
                                checked={limitTime === 0}
                                readOnly
                            />
                            <label htmlFor="limit-time-0">
                                <span>なし</span>
                            </label>
                            <div className={styles.teban}>
                                <img
                                    src={'/images/sunadokei_black.png'}
                                    alt="手番"
                                />
                            </div>
                        </div>
                        <div onClick={() => changeLimitTime(180)}>
                            <input
                                type="radio"
                                id="limit-time-180"
                                name="limit-time"
                                value="180"
                                checked={limitTime === 180}
                                readOnly
                            />
                            <label htmlFor="limit-time-180">
                                <span>3</span>分
                            </label>
                            <div className={styles.teban}>
                                <img
                                    src={'/images/sunadokei_black.png'}
                                    alt="手番"
                                />
                            </div>
                        </div>
                        <div onClick={() => changeLimitTime(300)}>
                            <input
                                type="radio"
                                id="limit-time-300"
                                name="limit-time"
                                value="300"
                                checked={limitTime === 300}
                                readOnly
                            />
                            <label htmlFor="limit-time-300">
                                <span>5</span>分
                            </label>
                            <div className={styles.teban}>
                                <img
                                    src={'/images/sunadokei_black.png'}
                                    alt="手番"
                                />
                            </div>
                        </div>
                        <div onClick={() => changeLimitTime(420)}>
                            <input
                                type="radio"
                                id="limit-time-420"
                                name="limit-time"
                                value="420"
                                checked={limitTime === 420}
                                readOnly
                            />
                            <label htmlFor="limit-time-420">
                                <span>7</span>分
                            </label>
                            <div className={styles.teban}>
                                <img
                                    src={'/images/sunadokei_black.png'}
                                    alt="手番"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className={styles.btnarea}>
                <button
                    onClick={() => {
                        Router.push('/');
                    }}
                >
                    HOME
                </button>
                <button onClick={init}>
                    {turn > 0 && turn < 4 ? 'GAME RESET' : 'GAME START'}
                </button>
            </div>

            {/* チャットのやり取り（機能OFF） */}
            {false && <ChatComponent chatList={chatList} chat={chat} />}

            <div className={styles.rulebtn}>
                <button>遊び方</button>
            </div>
        </Layout>
    );
}
