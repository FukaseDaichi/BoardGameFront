import { useRouter } from "next/router";
import SockJsClient from "react-stomp";
import { SystemConst } from "../../const/next.config";
import Layout from "../../components/layout";
import Head from "next/head";
import { SocketInfo } from "../../type";
import Chatmessage from "../../components/message/chatmessage";
import { useEffect, useState } from "react";
import ChatComponent from "../../components/chatcomponent";
import UserInfo from "../../components/hideout/userInfo";

let clientObj = null;

// 接続切れ
const disconnect = () => {
	console.log("接続が切れました");
};

export default function WereWolfRoom() {
	// roomId取得
	const router = useRouter();
	const { roomId } = router.query;
	const [messageFlg, setMessageFlg] = useState(false);
	const [message, setMessage] = useState("ようこそ！");
	const [playerName, setPlayerName] = useState(null);
	const [chatList, setChatList] = useState([]);

	// gamedata
	const [userList, setUserLst] = useState([]);
	const [memberFirldList, setMemberFirldList] = useState([]);
	const [rushFlg, setRushFlg] = useState(false);
	const [firldBuilding, setFirldBuilding] = useState({});

	// フラグの監視
	useEffect(() => {
		if (setMessageFlg) {
			window.setTimeout(() => {
				setMessageFlg(false);
				setMessage("");
			}, 4000);
		}
	}, [messageFlg]);

	// ルーム入室
	const roomIn = (userName: string) => {
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

	// チャット
	const chat = (message: string) => {
		if (playerName) {
		}
		const url = "/app/game-chat";
		const soketInfo: SocketInfo = {
			status: 101,
			roomId: roomId as string,
			userName: playerName,
			message: message,
			obj: null,
		};
		conect(url, soketInfo);
	};

	// ゲーム開始
	const init = () => {
		const url = "/app/hideout-init";
		const soketInfo: SocketInfo = {
			status: 300,
			roomId: roomId as string,
			userName: playerName,
			message: message,
			obj: null,
		};
		conect(url, soketInfo);
	};

	const wait = (index: number) => {
		const url = "/app/hideout-wait";
		const soketInfo: SocketInfo = {
			status: 400,
			roomId: roomId as string,
			userName: playerName,
			message: message,
			obj: index,
		};
		conect(url, soketInfo);
	};

	const rush = (index: number) => {
		const url = "/app/hideout-rush";
		const soketInfo: SocketInfo = {
			status: 500,
			roomId: roomId as string,
			userName: playerName,
			message: message,
			obj: index,
		};
		conect(url, soketInfo);
	};

	const conect = (url: string, soketInfo: SocketInfo) => {
		try {
			clientObj.sendMessage(url, JSON.stringify(soketInfo));
		} catch (e) {
			setMessageFlg(true);
			setMessage("通信エラー。再度試してください");
		}
	};

	const getMessage = (socketInfo: SocketInfo) => {
		switch (socketInfo.status) {
			case 100: // ルーム入室
				console.log(socketInfo);
				dataSet(socketInfo.obj);
				break;
			case 101: // チャット
				setChatList(socketInfo.obj);
				const messageFirld = document.getElementById("chat-firld");
				messageFirld.scrollTop = messageFirld.scrollHeight;
				break;

			case 200:
				// ルーム入室(同一名ユーザ入室)
				console.log(socketInfo);
				dataSet(socketInfo.obj);
				break;

			case 300: // ゲーム開始
				console.log(socketInfo);
				dataSet(socketInfo.obj);
			default:
				console.log(socketInfo);
		}
	};

	const dataSet = (obj) => {
		setUserLst(obj.userList);
		setRushFlg(obj.rushFlg);
		setFirldBuilding(obj.firldBuilding);
		setMemberFirldList(obj.memberFirldList);
	};

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
				<meta property="og:title" content="ハイドアウトオンライン" />
				<meta
					property="og:description"
					content="オンライン上でみんなでハイドアウト！"
				/>
				<title>Hideout</title>
			</Head>

			{messageFlg && <Chatmessage value={message} type="info" />}

			<SockJsClient
				url={SystemConst.Server.AP_HOST + SystemConst.Server.ENDPOINT}
				topics={["/topic/" + roomId]}
				ref={(client) => {
					clientObj = client;
				}}
				onMessage={(msg) => {
					getMessage(msg);
				}}
				onDisconnect={disconnect}
			/>

			<p>プレイヤーネーム：{playerName}</p>
			<div>
				<input type="text" id="username" />
				<button
					onClick={() => {
						const usernameDom: HTMLInputElement = document.getElementById(
							"username"
						) as HTMLInputElement;
						roomIn(usernameDom.value);
					}}
				>
					入室
				</button>
			</div>
			<div>
				<button onClick={init}>開始</button>
			</div>
			<div>
				<input type="number" id="taiki" />
				<button
					onClick={() => {
						const taikiDom: HTMLInputElement = document.getElementById(
							"taiki"
						) as HTMLInputElement;
						wait(Number(taikiDom.value));
					}}
				>
					待機
				</button>
			</div>
			<div>
				<input type="number" id="rush" />
				<button
					onClick={() => {
						const rushDom: HTMLInputElement = document.getElementById(
							"rush"
						) as HTMLInputElement;
						rush(Number(rushDom.value));
					}}
				>
					突入
				</button>
			</div>
			{userList.map((user, index: number) => {
				return <UserInfo key={index} user={user} />;
			})}

			<ChatComponent chatList={chatList} chat={chat} />
		</Layout>
	);
}
