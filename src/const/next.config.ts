/** システム定数クラス */
export namespace SystemConst {
	/** サーバー */
	export namespace Server {
		/** ホスト名 */
		export const AP_HOST = "http://localhost:8080/";
		//export const AP_HOST = "https://boardgameap.herokuapp.com/";
		export const CREATE_ROOM = "createroom";
		export const ENDPOINT = "boardgame-endpoint";
		export const SITE_URL = "https://board-game-whitefranc.vercel.app";
	}

	export namespace Message {
		export const MSG_SYSTEMERR = "エラーが発生しました。";
	}
	//　ファイル一覧
	export const ICON_LIST: string[] = [
		"icon1.jpeg",
		"icon1.jpg",
		"icon2.jpeg",
		"icon2.jpg",
		"icon3.jpeg",
		"icon3.jpg",
		"icon4.jpeg",
		"icon4.jpg",
		"icon5.jpeg",
		"icon5.jpg",
		"icon6.jpeg",
		"icon6.jpg",
		"icon7.jpeg",
		"icon7.jpg",
		"icon8.jpeg",
		"icon8.jpg",
	];
}
