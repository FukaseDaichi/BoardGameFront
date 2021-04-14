import { useRouter } from "next/router";
import SockJsClient from "react-stomp";
import { SystemConst } from "../../const/next.config";
import Layout from "../../components/layout";
import Head from "next/head";
import { SocketInfo } from "../../type";
import Chatmessage from "../../components/message/chatmessage";
import { useEffect, useState } from "react";
import ChatComponent from "../../components/chatcomponent";

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
		const url = "/app/werewolf-roomin";
		const soketInfo: SocketInfo = {
			status: 100,
			roomId: roomId as string,
			userName: userName,
			message: null,
			obj: null,
		};
		setPlayerName(userName);
		coneect(url, soketInfo);
	};

	const chat = (message: string) => {
		const url = "/app/chat";
		const soketInfo: SocketInfo = {
			status: 101,
			roomId: roomId as string,
			userName: playerName,
			message: message,
			obj: null,
		};
		coneect(url, soketInfo);
	};

	const coneect = (url: string, soketInfo: SocketInfo) => {
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
				break;
			case 101: // チャット
				console.log(socketInfo.obj);
				setChatList(socketInfo.obj);
				break;
			default:
				console.log(socketInfo);
		}
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
				<meta property="og:title" content="タイムボムオンライン" />
				<meta
					property="og:description"
					content="オンライン上でみんなでタイムボム！"
				/>
				<title>てすと</title>
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
				<input type="text" id="chat" />
				<button
					onClick={() => {
						const chatDom: HTMLInputElement = document.getElementById(
							"chat"
						) as HTMLInputElement;
						chat(chatDom.value);
					}}
				>
					チャット
				</button>
			</div>
			<ChatComponent />
		</Layout>
	);
}
