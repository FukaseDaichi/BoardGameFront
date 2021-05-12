import { useRouter } from "next/router";
import SockJsClient from "react-stomp";
import { SystemConst } from "../../const/next.config";
import Layout from "../../components/layout";
import Head from "next/head";
import { SocketInfo } from "../../type";
import Chatmessage from "../../components/message/chatmessage";
import { useEffect, useState, useCallback } from "react";
import ChatComponent from "../../components/chatcomponent";
import UserInfo from "../../components/werewolf/userInfo";
import styles from "../../styles/components/werewolf/room.module.scss";
import Router from "next/router";
import Start from "../../components/timebomb/start";
import RollCard from "../../components/werewolf/rollcard";
import ModalRollCard from "../../components/werewolf/modalrollcard";
import RollInfo from "../../components/werewolf/rollinfo";
import RollSelectTurn from "../../components/werewolf/rollselectturn";
import { WerewolfRoll } from "../../type/werewolf";

// 接続切れ
const disconnect = () => {
	console.log("接続が切れました");
};

// 役職設定用のカウンター
const cunter = (rollNo: number, plusFlg: boolean) => {
	const cunterDom = document.getElementById("cunter_" + rollNo);
	if (cunterDom) {
		let value = Number(cunterDom.textContent);
		if (plusFlg) {
			if (value < 15) {
				value++;
			}
		} else {
			if (value > 0) {
				value--;
			}
		}
		cunterDom.innerHTML = String(value);
	}
};

export default function WerewolfRoom() {
	// roomId取得
	const router = useRouter();
	const { roomId } = router.query;

	const [clientObj, setClientObj] = useState(null);
	const [messageList, setMessageList] = useState([]);
	const [playerName, setPlayerName] = useState(null);
	const [chatList, setChatList] = useState([]);

	// gamedata
	const [userList, setUserLst] = useState([]);
	const [turn, setTurn] = useState(0);
	const [winteamList, setWinteamList] = useState([]);
	const [staticRollList, setStaticRollList] = useState([]);
	const [rollList, setRollList] = useState([]);
	const [playerData, setPlayerData] = useState(null);

	// view
	const [startFlg, setStartFlg] = useState(false);
	const [modalRoll, setModalRoll] = useState(null);
	const [rollSelectTurnFlg, setRollSelectTurnFlg] = useState(false);

	// ルーム入室
	const roomIn = (userName: string) => {
		if (userName === "") {
			return;
		}
		const url = "/app/game-roomin";
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
			const url = "/app/game-changeIcon";
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
			if (playerName) {
				const url = "/app/game-chat";
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

	// 役職設定
	const setRoll = () => {
		const url = "/app/werewolf-setrollregulation";

		let intList: Array<number> = [];
		staticRollList.forEach((element: WerewolfRoll) => {
			const cunterDom = document.getElementById("cunter_" + element.rollNo);
			if (cunterDom) {
				const rollsize = Number(cunterDom.textContent);
				for (let i = 0; i < rollsize; i++) {
					intList.push(element.rollNo);
				}
			}
		});

		const soketInfo: SocketInfo = {
			status: 150,
			roomId: roomId as string,
			userName: playerName,
			message: null,
			obj: intList,
		};
		conect(url, soketInfo);
	};

	// ゲーム開始
	const init = () => {
		const url = "/app/werewolf-init";
		const soketInfo: SocketInfo = {
			status: 300,
			roomId: roomId as string,
			userName: playerName,
			message: null,
			obj: null,
		};
		conect(url, soketInfo);
	};

	// 役職選択
	const selectRoll = useCallback(
		(rollIndex: number) => {
			const url = "/app/werewolf-selectroll";
			const soketInfo: SocketInfo = {
				status: 400,
				roomId: roomId as string,
				userName: playerName,
				message: null,
				obj: rollIndex,
			};
			conect(url, soketInfo);
		},
		[playerName]
	);

	// 議論中アクション
	const discussionAction = useCallback(
		(targetUsername: string) => {
			const url = "/app/werewolf-discussionaction";

			let stringList: Array<string> = [];
			stringList.push(playerName);
			stringList.push(targetUsername);

			const soketInfo: SocketInfo = {
				status: 500,
				roomId: roomId as string,
				userName: playerName,
				message: null,
				obj: stringList,
			};
			conect(url, soketInfo);
		},
		[playerName]
	);

	// ターン変更
	const changeTurn = useCallback(
		(turn: number) => {
			const url = "/app/werewolf-changeturn";
			const soketInfo: SocketInfo = {
				status: 600,
				roomId: roomId as string,
				userName: playerName,
				message: null,
				obj: turn,
			};
			conect(url, soketInfo);
		},
		[playerName]
	);

	// 投票
	const voting = useCallback(
		(username: string) => {
			const url = "/app/werewolf-voting";
			const soketInfo: SocketInfo = {
				status: 700,
				roomId: roomId as string,
				userName: playerName,
				message: null,
				obj: username,
			};
			conect(url, soketInfo);
		},
		[playerName]
	);

	const conect = (url: string, soketInfo: SocketInfo) => {
		try {
			clientObj.sendMessage(url, JSON.stringify(soketInfo));
		} catch (e) {
			setMessageList(messageList.concat("通信エラー。再度試してください"));
		}
	};

	const getMessage = (socketInfo: SocketInfo) => {
		console.log(socketInfo);

		switch (socketInfo.status) {
			case 100: // ルーム入室
				dataSet(socketInfo.obj);
				break;
			case 101: // チャット
				setChatList(socketInfo.obj);
				const messageFirld = document.getElementById("chat-firld");
				messageFirld.scrollTop = messageFirld.scrollHeight;
				break;

			case 150: // 役職設定
				dataSet(socketInfo.obj);
				break;

			case 200:
				// ルーム入室(同一名ユーザ入室)
				dataSet(socketInfo.obj);
				break;

			case 300: // ゲーム開始
				// ゲームスタート
				setStartFlg(true);

				dataSet(socketInfo.obj);
				break;

			case 400: // 役職選択
				dataSet(socketInfo.obj);
				break;

			case 404: // 例外
				setMessageList(messageList.concat(socketInfo.message));
				break;

			case 500: // 議論アクション
				dataSet(socketInfo.obj);
				break;

			case 600: // ターン変更
				dataSet(socketInfo.obj);
				break;

			case 650: // アイコン変更
				setUserLst(socketInfo.obj);
				break;

			case 700: // 投票
				dataSet(socketInfo.obj);
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

	const dataSet = (obj) => {
		setUserLst(obj.userList);
		setWinteamList(obj.winteamList);
		setTurn(obj.turn);
		setStaticRollList(obj.staticRollList);
		setRollList(obj.rollList);
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

	// 勝敗監視
	useEffect(() => {}, [winteamList.length]);

	// 入室時
	useEffect(() => {
		const userArray = userList.filter((element) => {
			return element.userName === playerName;
		});
		if (userArray.length > 0) {
			const btnDom = document.querySelector("." + styles.roominbtn);
			if (btnDom.classList.contains(styles.in)) {
				return;
			}
			btnDom.classList.add(styles.in);

			// アイコン初期設定
			if (userArray[0].userIconUrl === null) {
				console.log(userArray[0]);
				changeIcon("/images/icon/icon" + userArray[0].userNo + ".jpg");
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

  // 役職選択表示制御
	useEffect(() => {
		if (turn === 1) {
			setRollSelectTurnFlg(true);
		} else if (rollSelectTurnFlg && turn === 2) {
			setTimeout(() => {
				setRollSelectTurnFlg(false);
			}, 4000);
		} else {
			setRollSelectTurnFlg(false);
		}
	}, [turn, rollSelectTurnFlg]);

	return (
		<Layout home={false}>
			<style jsx global>{`
				body {
					background-image: url(/images/hideout/hideoutbackground.png);
					background-attachment: fixed;
					background-size: 370px;
					background-position: bottom left;
					background-repeat: no-repeat;
					overflow-x: hidden;
					background-color: #ecebeb;
				}
			`}</style>
			<Head>
				<meta
					property="og:image"
					content={
						SystemConst.Server.SITE_URL +
						"/images/hideout/hideoutbackground.png"
					}
				/>
				<meta property="og:title" content="セカンドワンナイト人狼" />
				<meta
					property="og:description"
					content="セカンドワンナイト人狼！　役職を選べる1日で終わる人狼ゲーム！ 初心者にもおすすめ！"
				/>
				<title>セカンドワンナイト人狼</title>
			</Head>
			{/* 開始合図 */}
			{startFlg && <Start />}

			{/* デバッグ用 */}
			<input type="text" id="usernametest" maxLength={20} />
			<button
				onClick={() => {
					const usernameDom: HTMLInputElement = document.getElementById(
						"usernametest"
					) as HTMLInputElement;
					roomIn(usernameDom.value);
				}}
			>
				Room IN
			</button>
			<button onClick={setRoll}>役職設定</button>
			{messageList.map((value, index) => {
				if (index === messageList.length - 1) {
					return <Chatmessage value={value} type="info" key={index} />;
				}
			})}
			<SockJsClient
				url={SystemConst.Server.AP_HOST + SystemConst.Server.ENDPOINT}
				topics={["/topic/" + roomId]}
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
				<input type="text" id="username" maxLength={20} />
				<button
					onClick={() => {
						const usernameDom: HTMLInputElement = document.getElementById(
							"username"
						) as HTMLInputElement;
						roomIn(usernameDom.value);
					}}
				>
					Room IN
				</button>
			</div>

			{/* ユーザ情報 */}
			<div className={styles.userfirld}>
				{userList.map((user, index: number) => {
					return (
						<UserInfo
							key={index}
							user={user}
							ownFlg={user.userName === playerName}
							userColor={SystemConst.PLAYER_COLOR_LIST[index]}
							changeIcon={changeIcon}
							turn={turn}
							voting={voting}
							discuttionAction={discussionAction}
						/>
					);
				})}
			</div>

			{/* 役職情報 */}
			{rollList.length > 0 && (
				<RollInfo
					rollList={rollList}
					setModalRoll={setModalRoll}
					userList={userList}
				/>
			)}

			<div className={styles.rollselect}>
				{staticRollList.map((element: WerewolfRoll, index: number) => {
					return (
						<div key={index} style={{ order: element.teamNo }}>
							<RollCard
								roll={element}
								size={60}
								fontSize={1.2}
								modalView={() => setModalRoll(element)}
							/>
							<div className={styles.counter}>
								<div
									className={styles.counterbtn}
									onClick={() => {
										cunter(element.rollNo, false);
									}}
								>
									-
								</div>
								<div className={styles.number} id={"cunter_" + element.rollNo}>
									0
								</div>
								<div
									className={styles.counterbtn}
									onClick={() => {
										cunter(element.rollNo, true);
									}}
								>
									+
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{modalRoll && (
				<ModalRollCard
					roll={modalRoll}
					hidden={() => {
						setTimeout(() => {
							setModalRoll(null);
						}, 450);
					}}
				/>
			)}
			<div className={styles.btnarea}>
				<button
					onClick={() => {
						Router.push("/");
					}}
				>
					HOME
				</button>
				<button onClick={init}>{turn > 0 ? "GAME RESET" : "GAME START"}</button>
			</div>
			{/* チャットのやり取り（機能OFF） */}
			{false && <ChatComponent chatList={chatList} chat={chat} />}

			{!startFlg && rollSelectTurnFlg && playerData && (
				<RollSelectTurn
					turn={turn}
					user={playerData}
					setModalRoll={setModalRoll}
					selectRoll={selectRoll}
					roll={playerData.roll}
					userList={userList}
					rollList={rollList}
				/>
			)}

			<input
				type="number"
				id="turn"
				onChange={() => {
					const test = document.getElementById("turn") as HTMLInputElement;
					setTurn(Number(test.value));
				}}
			/>
		</Layout>
	);
}
