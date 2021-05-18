import styles from "../../styles/components/werewolf/rule.module.scss";

type RuleProps = {
	endFnc: () => void;
};

export default function Rule(props: RuleProps) {
	return (
		<div className={styles.rule} onClick={props.endFnc}>
			<div>
				<div>
					<h1>遊び方</h1>
					<h2>概要</h2>
					自分で役職が選択できるワンナイト人狼ゲームです。
					<br />
					「役職選択」「議論」「投票」の３つの流れでゲームを進行します。役職選択で得た情報をもとに議論ができるため、人狼ゲームで何を話したらよいかわからない方に特におすすめです！
					<br />
					<h2>準備</h2>
					このゲームは参加者に「ＮＰＣ」が加わりゲームが始まります。そのため、ゲーム開始前に、参加者
					+ １
					の好きな役職を設定ボタンで設定してください。「おすすめセット」では、おすすめな役職配分を設定できます。
					<br />
					議論時間を３分間などあらかじめ決定してください。
					<br />
					※役職の数が参加者 +
					１よりも多い場合、役欠け（プレイヤーに配られれない役職）が発生します。全ての人狼が役欠けになることはありません。
					<h2>役職選択</h2>
					任意に順番が決定します。スタートプレイヤーには２つ、他のプレイヤーには１つの役職が配られます。
					<br />
					プレイヤーは２つの役職から好きな役職を選び、残った役職を次のプレイヤーに渡します。最後のプレイヤーに選ばれなかった役職が「ＮＰＣ」の役職となります。
					<br />
					この時の情報（「初めに配られた役職」「渡された役職」「選んだ役職」）は議論時間で好きに話せます。忘れないようにしてください。
					<h2>議論</h2>
					あらかじめ設定した時間内で議論します。時間が来たら終了ボタンで議論を終了してください。
					一部の役職は特殊能力を使用することができます。
					<h2>投票</h2>
					議論で得た情報をもとに投票します。投票数が最も多かったプレイヤーが処刑されます。仮に全てのプレイヤーに１票ずつ投票されていた場合は全てのプレイヤーが処刑されます。
					<br />
					役職の勝利条件をもとに勝敗が決定します。
				</div>
			</div>
		</div>
	);
}
