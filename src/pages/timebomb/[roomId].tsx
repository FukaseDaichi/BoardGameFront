import { useRouter } from "next/router";
import SockJsClient from "react-stomp";
import { SystemConst } from "../../const/next.config";

let clientObj = null;

const disconnect = () => {
	alert("接続が切れました。ホームに戻ります");
	location.href = "/";
};

export default function Room() {
	const router = useRouter();
	const { roomId } = router.query;

	const roomIn = (msg) => {
		const url = "/app/roomin";
		console.log(url);
		console.log(JSON.stringify(msg));
		console.log(msg.roomId);
		clientObj.sendMessage(url, JSON.stringify(msg));
	};

	return (
		<>
			<SockJsClient
				url={SystemConst.Server.AP_HOST + SystemConst.Server.ENDPOINT}
				topics={["/topic/" + roomId + "/timebomb"]}
				ref={(client) => {
					clientObj = client;
				}}
				onMessage={(msg) => {
					console.log(msg);
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
						roomId: roomId,
						userName: usernameDom.value,
					});
				}}
			>
				入室
			</button>
			<p>{roomId}</p>
		</>
	);
}
