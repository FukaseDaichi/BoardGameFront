import styles from "../../styles/components/werewolf/rollinfo.module.scss";
import RollCard from "./rollcard";
import { WerewolfRoll } from "../../type/werewolf";

type RollInfoProps = {
	rollList: Array<WerewolfRoll>;
	setModalRoll: (WerewolfRoll) => void;
};

export default function RollInfo(props: RollInfoProps) {
	return (
		<div className={styles.rollinfo}>
			{props.rollList.map((value, index) => {
				return (
					<div key={index}>
						<RollCard
							roll={value}
							size={60}
							modalView={() => props.setModalRoll(value)}
						/>
					</div>
				);
			})}
			<div></div>
		</div>
	);
}
