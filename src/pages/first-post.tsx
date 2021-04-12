import { stringify } from "gray-matter";
import Icon from "../components/userInfo/icon";

export default function FirstPost() {
	return (
		<>
			<Icon
				mainIconSrc="/images/icon/icon1.jpg"
				changeIcon={(src: string) => {
					console.log("実行");
					return "aa";
				}}
			/>
		</>
	);
}
