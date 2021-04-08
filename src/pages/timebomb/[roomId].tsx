import { useRouter } from "next/router";
import SockJsClient from "react-stomp";
import { SystemConst } from "../../const/next.config";
import Layout from "../../components/layout";
import Start from "../../components/timebomb/start";
import { useCallback, useEffect, useState } from "react";
import { RoomUserInfo, TimeBombUser, LeadCards } from "../../type";
import UserInfo from "../../components/timebomb/userInfo";
import Chatmessage from "../../components/message/chatmessage";
import styles from "../../styles/components/timebomb/room.module.scss";

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
	const [messageFlg, setMessageFlg] = useState(false);
	const [message, setMessage] = useState("ようこそ！");

	// スタートフラグの監視
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
	}, [startFlg, messageFlg]);

	// ルーム入室
	const roomIn = (msg: RoomUserInfo) => {
		const url = "/app/roomin";
		playerName = msg.userName;
		clientObj.sendMessage(url, JSON.stringify(msg));
	};

	// ゲームスタート
	const start = (msg: RoomUserInfo) => {
		const url = "/app/start";
		clientObj.sendMessage(url, JSON.stringify(msg));
	};

	// メッセージ取得
	const receve = (msg) => {
		// エラーケース
		if (msg.status) {
			switch (msg.status) {
				case 200:
					setMessageFlg(true);
					setMessage(msg.message);
					setTimeBombUserList(msg.obj.userList);
					if (msg.obj.leadCardsList) {
						setLeadCardsList(msg.obj.leadCardsList);
					}
					return;
				case 404:
					setMessageFlg(true);
					setMessage(msg.message);

					return;
				default:
					setMessageFlg(true);
					setMessage(msg.message);
			}
		}

		setTimeBombUserList(msg.userList);
		if (msg.leadCardsList) {
			setLeadCardsList(msg.leadCardsList);
		}

		// 開始判定
		if (msg.turn === 1) {
			setStartFlg(true);
		}

		// 勝敗判定
		if (msg.winnerTeam > 0) {
			switch (msg.winnerTeam) {
				case 1:
					console.log("時空警察の勝ち");
					break;
				case 2:
					console.log("ボマーの勝ち");
					break;
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
		clientObj.sendMessage(url, JSON.stringify(data));
	};

	return (
		<Layout home={false}>
			{startFlg && <Start />}
			{messageFlg && <Chatmessage value={message} type="info" />}
			<SockJsClient
				url={SystemConst.Server.AP_HOST + SystemConst.Server.ENDPOINT}
				topics={["/topic/" + roomId + "/timebomb"]}
				ref={(client) => {
					clientObj = client;
				}}
				onMessage={(msg) => {
					console.log(msg);
					receve(msg);
				}}
				onDisconnect={disconnect}
			/>
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
				開始
			</button>
			<div className={styles.userInfo}>
				{timeBombUserList.map((value: TimeBombUser, index: number) => {
					// 手札作成
					const cardsList: Array<LeadCards> = [];
					if (leadCardsList) {
						leadCardsList.forEach((value: LeadCards, cardIndex: number) => {
							if (Math.floor(cardIndex / 5) === index) {
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
						></UserInfo>
					);
				})}
			</div>
		</Layout>
	);
}
