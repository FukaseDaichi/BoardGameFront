import Link from "next/link";
import Layout from "../components/layout";
import { SystemConst } from "../const/next.config";

const createRoombtn = async () => {
	const url: string =
		SystemConst.Server.AP_HOST + SystemConst.Server.CREATE_ROOM;
	const room = await fetch(url)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw new Error();
			}
		})
		.then((resJson) => {
			return resJson;
		})
		.catch((err) => {
			console.log(err);
		});
	const roomUrlDom = document.querySelector("#room-url") as HTMLElement;
	roomUrlDom.innerText = location.href + "timebomb/" + room.roomId;
};

const copyText = () => {
	const roomUrlDom = document.querySelector("#room-url");
	document.getSelection().selectAllChildren(roomUrlDom);
	// 選択範囲のコピー
	document.execCommand("copy");
	// テキスト選択の解除
	document.getSelection().empty();
};

export default function CreateRoom() {
	return (
		<Layout home={true}>
			<div>
				<button
					type="button"
					className="btn btn-outline-secondary"
					onClick={createRoombtn}
				>
					部屋作成
				</button>
			</div>

			<div className="btn-group">
				<button type="button" className="btn btn-secondary" onClick={copyText}>
					コピー
				</button>
				<div id="room-url">aaaaaaaaaaaafda</div>
				<button type="button" className="btn btn-outline-secondary">
					入室
				</button>
			</div>
		</Layout>
	);
}
