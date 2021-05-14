import styles from "../../styles/components/werewolf/result.module.scss";
import { WerewolfUser } from "../../type/werewolf";

type ResultProps = {
	userList: Array<WerewolfUser>;
	winteamList: Array<number>;
	npcuser: WerewolfUser;
};

export default function Result(props: ResultProps) {
	return (
		<div className={styles.result}>
			<div>
				<div>
					<div>
						<img src="" alt="" />
						<div></div>
					</div>
					<table className="table table-dark">
						<thead>
							<tr>
								<th scope="col">名前</th>
								<th scope="col">役職</th>
								<th scope="col">スコア</th>
								<th scope="col">行動</th>
							</tr>
						</thead>
						<tbody>
							{props.userList.map((element: WerewolfUser, index: number) => {
								return (
									<tr>
										<td>{element.userName}</td>
										<td>{element.roll.name}</td>
										<td>{element.score}</td>
										<td>{element.lastMessage}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
