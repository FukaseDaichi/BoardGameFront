import { useRouter } from "next/router";
import SockJsClient from "react-stomp";
import { SystemConst } from "../../const/next.config";
import Layout from "../../components/layout";
import { useCallback, useEffect, useState } from "react";
import { RoomUserInfo, TimeBombUser, LeadCards } from "../../type";
import UserInfo from "../../components/timebomb/userInfo";

let clientObj = null;
let playerName = null;

// 接続切れ
const disconnect = () => {
	alert("接続が切れました。ホームに戻ります");
	location.href = "/";
};

export default function Room() {
	// roomId取得
	const router = useRouter();
	const { roomId } = router.query;

	// react hooks state
	const [timeBombUserList, setTimeBombUserList] = useState([]);
	const [leadCardsList, setLeadCardsList] = useState([]);

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
		setTimeBombUserList(msg.userList);
		if (msg.leadCardsList) {
			setLeadCardsList(msg.leadCardsList);
		}

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
			<p>{roomId}</p>
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
		</Layout>
	);
}
