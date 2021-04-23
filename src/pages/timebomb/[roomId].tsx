import { useRouter } from "next/router";
import SockJsClient from "react-stomp";
import { SystemConst } from "../../const/next.config";
import Layout from "../../components/layout";
import Start from "../../components/timebomb/start";
import { useEffect, useState, useCallback } from "react";
import { RoomUserInfo, TimeBombUser, LeadCards, SocketInfo } from "../../type";
import UserInfo from "../../components/timebomb/userInfo";
import Modal from "../../components/modal";
import Chatmessage from "../../components/message/chatmessage";
import styles from "../../styles/components/timebomb/room.module.scss";
import HeaderInfo from "../../components/timebomb/headInfo";
import CountdownClock from "../../components/countdownclock";
import Router from "next/router";
import Head from "next/head";

let clientObj = null;
let playerName = null;

// 接続切れ
const disconnect = () => {
	console.log("接続が切れました");
};

export default function Room() {
	// roomId取得
	const router = useRouter();
	const { roomId } = router.query;

	// react hooks state
	const [timeBombUserList, setTimeBombUserList] = useState([]);
	const [leadCardsList, setLeadCardsList] = useState([]);
	const [startFlg, setStartFlg] = useState(false);

	// メッセージ用データセット
	const [messageFlg, setMessageFlg] = useState(false);
	const [message, setMessage] = useState("ようこそ！");

	// ラウンドメッセージ用データセット
	const [round, setRound] = useState(0);
	const [roundMessageFlg, setRoundMessageFlg] = useState(false);

	// ゲーム内情報
	const [turn, setTurn] = useState(0);
	const [releaseNo, setReleaseNo] = useState(0);
	const [limitTime, setLimitTime] = useState(0);

	// 勝敗表示用
	const [endFlg, setEndFlg] = useState(false);
	const [bommerFlg, setBommerFlg] = useState(false);
	const [policeFlg, setPoliceFlg] = useState(false);

	// フラグの監視
	useEffect(() => {
		if (startFlg) {
			window.setTimeout(() => {
				setStartFlg(false);
			}, 4000);
		}

		if (setMessageFlg) {
			window.setTimeout(() => {
				setMessageFlg(false);
				setMessage("");
			}, 4000);
		}

		if (roundMessageFlg) {
			window.setTimeout(() => {
				document.querySelector("body").classList.remove("modal_active");
				setRoundMessageFlg(false);
			}, 5000);
		}
	}, [startFlg, messageFlg, roundMessageFlg]);

	const coneect = (url: string, msg: RoomUserInfo) => {
		try {
			clientObj.sendMessage(url, JSON.stringify(msg));
		} catch (e) {
			setMessageFlg(true);
			setMessage("通信エラー。再度試してください");
		}
	};
	// ルーム入室
	const roomIn = (msg: RoomUserInfo) => {
		const url = "/app/roomin";
		playerName = msg.userName;

		coneect(url, msg);
	};

	// ゲームスタート
	const start = (msg: RoomUserInfo) => {
		const url = "/app/start";
		coneect(url, msg);
	};

	// メッセージ取得
	const receve = (msg) => {
		// エラーケース
		if (msg.status) {
			switch (msg.status) {
				case 200:
					setMessageFlg(true);
					setMessage(msg.message);
					setData(msg.obj);
					return;
				case 201:
					// アイコン変更時
					setTimeBombUserList(msg.obj);
					return;
				case 404:
					setMessageFlg(true);
					setMessage(msg.message);
					return;

				case 900:
					// 制限時間変更
					setLimitTime(msg.obj);
					return;

				default:
					setMessageFlg(true);
					setMessage(msg.message);
					return;
			}
		}

		// 初回入室時
		if (timeBombUserList.length === 0 && playerName != null) {
			document.querySelector("." + styles.roominbtn).classList.add(styles.in);
		}

		// 解除メッセージ判定
		if (releaseNo < msg.releaseNo) {
			setMessageFlg(true);
			setMessage("解除に成功");
		}

		// データ設定
		setData(msg);

		// 開始判定
		if (msg.turn === 1) {
			// データリセット
			document.querySelector("body").classList.remove("modal_active");
			scrollTo(0, 0);
			setBommerFlg(false);
			setPoliceFlg(false);
			setStartFlg(true);
		}

		// 勝敗判定
		if (msg.winnerTeam > 0) {
			switch (msg.winnerTeam) {
				case 1:
					scrollTo(0, 0);
					setPoliceFlg(true);
					setEndFlg(true);
					return;
				case 2:
					scrollTo(0, 0);
					setBommerFlg(true);
					setEndFlg(true);
					return;
			}
		}
	};

	// データセット
	const setData: any = (room) => {
		setTimeBombUserList(room.userList);
		setTurn(room.turn);
		setReleaseNo(room.releaseNo);
		setEndFlg(false);

		if (room.leadCardsList) {
			setLeadCardsList(room.leadCardsList);
		}
		if (round != room.round && room.winnerTeam === 0) {
			setRound(room.round);
			if (room.round > 1) {
				scrollTo(0, 0);
				setRoundMessageFlg(true);
			}
		}
	};

	// ゲームプレイ
	const play = (cardIndex: number) => {
		const url = "/app/play";
		const data: RoomUserInfo = {
			action: "play",
			roomId: roomId as string,
			userName: playerName,
			cardIndex: cardIndex,
			winTeam: 0,
		};
		coneect(url, data);
	};

	// アイコン変更
	const changeIcon = useCallback((iconUrl: string) => {
		const url = "/app/changeIcon";
		const usrInfo: RoomUserInfo = {
			action: iconUrl,
			roomId: roomId as string,
			userName: playerName,
			cardIndex: 0,
			winTeam: 0,
		};
		coneect(url, usrInfo);
	}, []);

	const limittimeDone = useCallback(
		(pturn: number) => {
			let turnFlg: boolean = false;
			timeBombUserList.forEach((value: TimeBombUser) => {
				if (value.userName === playerName && value.turnFlg) {
					turnFlg = true;
				}
			});

			if (turnFlg) {
				const url = "/app/timebomb-limittime";
				const info: SocketInfo = {
					status: 600,
					roomId: roomId as string,
					userName: playerName,
					message: null,
					obj: pturn,
				};

				clientObj.sendMessage(url, JSON.stringify(info));
			}
		},
		[timeBombUserList]
	);

	// 制限時間変更
	const changeLimitTme = useCallback((time: number) => {
		const url = "/app/timebomb-setlimittime";
		const info: SocketInfo = {
			status: 900,
			roomId: roomId as string,
			userName: playerName,
			message: null,
			obj: time,
		};

		clientObj.sendMessage(url, JSON.stringify(info));
	}, []);

	return (
		<Layout home={false}>
			<style jsx global>{`
				body {
					background-image: url(/images/background.jpg);
					background-attachment: fixed;
					background-size: 370px;
					background-position: bottom left;
					background-repeat: no-repeat;
				}
			`}</style>
			<Head>
				<meta
					property="og:image"
					content={SystemConst.Server.SITE_URL + "/images/background.jpg"}
				/>
				<meta property="og:title" content="タイムボムオンライン" />
				<meta
					property="og:description"
					content="オンライン上でみんなでタイムボム！"
				/>
				<title>タイムボム</title>
			</Head>
			{turn > 0 && (
				<HeaderInfo
					releaseNo={releaseNo}
					userSize={timeBombUserList.length}
					limit={timeBombUserList.length * 4 - turn + 1}
				/>
			)}

			{startFlg && <Start />}
			{roundMessageFlg && (
				<Modal type="one">
					<div className={styles.roundMessage} data-text={`Round${round}`}>
						{round <= 3 ? `ROUND${round}` : "FINAL"}
					</div>
				</Modal>
			)}

			{bommerFlg && (
				<Modal type={"seven"}>
					<div className={styles.result}>
						<img src="/images/failed.png" alt="結果" />
					</div>
				</Modal>
			)}

			{policeFlg && (
				<Modal type={"five"}>
					<div className={styles.result}>
						<img src="/images/success.png" alt="結果" />
					</div>
				</Modal>
			)}

			{messageFlg && <Chatmessage value={message} type="info" />}
			<SockJsClient
				url={SystemConst.Server.AP_HOST + SystemConst.Server.ENDPOINT}
				topics={["/topic/" + roomId + "/timebomb"]}
				ref={(client) => {
					clientObj = client;
				}}
				onMessage={(msg) => {
					// デバッグ用
					// console.log(msg);
					receve(msg);
				}}
				onDisconnect={disconnect}
			/>

			{turn < 1 && (
				<div className={styles.roominbtn}>
					<p>
						<label htmlFor="username">Name</label>
					</p>
					<input type="text" id="usernametest" />
					<button
						onClick={() => {
							const usernameDom: HTMLInputElement = document.getElementById(
								"usernametest"
							) as HTMLInputElement;
							const name: string = usernameDom.value;
							if (name === "") {
								return false;
							}
							roomIn({
								action: "roomIn",
								roomId: roomId as string,
								userName: name,
								cardIndex: 0,
								winTeam: 0,
							});
						}}
					>
						Room IN
					</button>
				</div>
			)}
			{
				// デバッグ用
				true && (
					<>
						<input type="text" id="username" />
						<button
							onClick={() => {
								const usernameDom: HTMLInputElement = document.getElementById(
									"username"
								) as HTMLInputElement;

								roomIn({
									action: "roomIn",
									roomId: roomId as string,
									userName: usernameDom.value,
									cardIndex: 0,
									winTeam: 0,
								});
							}}
						>
							入室
						</button>
						<button onClick={() => limittimeDone(turn)}>タイムリミット</button>
					</>
				)
			}

			{turn > 0 && (
				<div className={`d-flex justify-content-center ${styles.light}`}>
					{timeBombUserList.map((value: TimeBombUser, index: number) => {
						return (
							<div
								key={index}
								className={releaseNo > index ? styles.opend : ""}
							>
								<img src="/images/rightoff.png" alt="light" />
								<img src="/images/righton.png" alt="light" />
							</div>
						);
					})}
				</div>
			)}

			{turn > 0 && !endFlg && !startFlg && (
				<CountdownClock limitDone={limittimeDone} timeLimit={183} turn={turn} />
			)}

			<div className={styles.userInfo}>
				{timeBombUserList.map((value: TimeBombUser, index: number) => {
					// 手札作成
					const cardsList: Array<LeadCards> = [];
					if (leadCardsList) {
						leadCardsList.forEach((value: LeadCards, cardIndex: number) => {
							if (Math.floor(cardIndex / (6 - round)) === index) {
								cardsList.push(leadCardsList[cardIndex]);
							}
						});
					}
					return (
						<UserInfo
							user={value}
							cardlist={cardsList}
							key={index}
							ownFlg={playerName === value.userName}
							playfnc={play}
							round={round}
							changeIcon={changeIcon}
							endFlg={endFlg}
						></UserInfo>
					);
				})}
			</div>
			<div className={styles.limittimeinputarea}>
				<div onClick={() => changeLimitTme(0)}>
					<input
						type="radio"
						id="limit-time-0"
						name="limit-time"
						value="0"
						checked={limitTime === 0}
						readOnly
					/>
					<label htmlFor="limit-time-0">
						<span>NONE</span>
					</label>
					<div className={styles.teban}>
						<img src={"/images/hasami.png"} alt="手番" />
					</div>
				</div>
				<div onClick={() => changeLimitTme(180)}>
					<input
						type="radio"
						id="limit-time-180"
						name="limit-time"
						value="180"
						checked={limitTime === 180}
						readOnly
					/>
					<label htmlFor="limit-time-180">
						<span>3</span>min
					</label>
					<div className={styles.teban}>
						<img src={"/images/hasami.png"} alt="手番" />
					</div>
				</div>
				<div onClick={() => changeLimitTme(300)}>
					<input
						type="radio"
						id="limit-time-300"
						name="limit-time"
						value="300"
						checked={limitTime === 300}
						readOnly
					/>
					<label htmlFor="limit-time-300">
						<span>5</span>min
					</label>
					<div className={styles.teban}>
						<img src={"/images/hasami.png"} alt="手番" />
					</div>
				</div>
				<div onClick={() => changeLimitTme(420)}>
					<input
						type="radio"
						id="limit-time-420"
						name="limit-time"
						value="420"
						checked={limitTime === 420}
						readOnly
					/>
					<label htmlFor="limit-time-420">
						<span>7</span>min
					</label>
					<div className={styles.teban}>
						<img src={"/images/hasami.png"} alt="手番" />
					</div>
				</div>
			</div>
			<div className={styles.btnarea}>
				<button
					onClick={() => {
						Router.push("/");
					}}
				>
					HOME
				</button>
				<button
					onClick={() => {
						start({
							action: "start",
							roomId: roomId as string,
							userName: playerName,
							cardIndex: 0,
							winTeam: 0,
						});
					}}
				>
					{turn > 0 ? "GAME RESET" : "GAME START"}
				</button>
			</div>
		</Layout>
	);
}
