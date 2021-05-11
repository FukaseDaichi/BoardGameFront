import styles from "../../styles/components/werewolf/rollinfo.module.scss";
import RollCard from "./rollcard";
import { WerewolfRoll } from "../../type/werewolf";

type RollInfoProps = {
	rollList: Array<WerewolfRoll>;
	setModalRoll: (WerewolfRoll) => void;
	userSize: number;
};

export default function RollInfo(props: RollInfoProps) {
	let rollNoList: Array<number> = [];
	return (
		<>
			<div className={styles.rollinfo}>
				{props.rollList.map((value: WerewolfRoll, index: number) => {
					if (!rollNoList.includes(value.rollNo)) {
						rollNoList.push(value.rollNo);

						return (
							<div
								key={index}
								className={styles.content}
								style={{ order: value.teamNo }}
							>
								<RollCard
									roll={value}
									size={60}
									fontSize={1.2}
									modalView={() => props.setModalRoll(value)}
								/>
								<div className={styles.rollSize}>
									<span>×</span>
									<span>
										{
											props.rollList.filter((element) => {
												return element.rollNo === value.rollNo;
											}).length
										}
									</span>
								</div>
							</div>
						);
					}
				})}
			</div>
			{props.userSize + 1 < props.rollList.length && (
				<div className={styles.rollmissing}>
					役欠け <span>{props.rollList.length - props.userSize - 1}</span>
				</div>
			)}
		</>
	);
}
