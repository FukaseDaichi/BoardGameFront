import styles from "../../styles/components/werewolf/rollselectturn.module.scss";
import { useEffect, useState } from "react";
import HoloCard from "../card/holoCard";
import AnimationBtn from "../button/animationbtn";
import Loadingdod from "../../components/text/loadingdod";
import { WerewolfRoll } from "../../type/werewolf";
import RollCard from "./rollcard";

const view = () => {
	document.querySelector("body").classList.add("modal_active_second");
};

const unView = () => {
	document.querySelector("body").classList.remove("modal_active_second");
	document.getElementById("rollselectturn-area").classList.add(styles.out);
};

type RushTurnProps = {
	turn: number;
	handRollList: Array<WerewolfRoll>;
	setModalRoll: (WerewolfRoll) => void;
	selectRoll: (number) => void;
	roll: WerewolfRoll;
};

export default function RollSelectTurn(props: RushTurnProps) {
	const [turn, setTurn] = useState(0);

	if (turn !== props.turn) {
		setTurn(props.turn);
	}

	useEffect(() => {
		if (turn === 1) {
			view();
		}
		return unView;
	}, [turn]);

	return (
		<div className={styles.rollselect} id="rollselectturn-area">
			<div className={styles.rollselect_background}>
				<div className={styles.area}>
					{props.handRollList.length > 0 && (
						<span>
							待機中 <Loadingdod color={"white"} />
						</span>
					)}

					{props.handRollList && props.handRollList.length > 0 && (
						<div className={styles.handrollarea}>
							{props.handRollList.map(
								(element: WerewolfRoll, index: number) => {
									return (
										<div key={index}>
											<RollCard
												roll={element}
												size={140}
												fontSize={2.0}
												modalView={() => props.setModalRoll(element)}
											/>
											<AnimationBtn
												value="選択"
												onClickFnc={() => {
													props.selectRoll(element.no);
												}}
												viewFlg={props.handRollList.length === 2}
												animeClass="heartbeat"
											/>
										</div>
									);
								}
							)}
						</div>
					)}
					{props.roll && (
						<div className={styles.slectedroll}>
							<div>あなたの役職</div>

							<RollCard
								roll={props.roll}
								size={140}
								fontSize={2.0}
								modalView={() => props.setModalRoll(props.roll)}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
